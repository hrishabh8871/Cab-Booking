// Import Library
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Switch } from 'antd';
import './index.css'
import axios from 'axios';
import * as Pusher from "pusher-js"



class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            pickup: null,
            drop: null,
            availableCab: null,
            isTaxiBooked: false,
            bookedCabData: null,
            startTripOTP: null,
            isStartTrip: false,
            endTrip: false,
        };
    }



    async componentDidMount() {

        try {

            let loggedInUserData = JSON.parse(localStorage.getItem('userIDRider'))

            console.log("LOGGEDINUSER ------>", loggedInUserData)

            this.setState({
                userData: loggedInUserData
            })

            if (true) {
                var pusher = new Pusher('306f809ac5ff99a6198a', {
                    cluster: 'ap2'
                });

                var channel = pusher.subscribe('newRideData');
                channel.bind('inserted', async function (data) {
                    if (loggedInUserData && loggedInUserData.data && loggedInUserData.data['role'] === 'cabDriver') {
                        if (loggedInUserData.data['_id'] === data['cabDriverID']) {
                            this.setState({
                                bookedCabData: data
                            })

                            localStorage.setItem('bookedRideID', data['_id'])
                        }
                    }

                }.bind(this));
            }
        } catch (err) {

        }

    }

    onChange(e) {
        console.log(`switch to ${e.target.value}`);

        this.setState({
            [e.target.name]: e.target.value
        })

    }

    async bookTaxi() {
        console.log("SEARCH NEAR BY TAXI")
        // console.log("PICK -------->", this.state.pickup)
        // console.log("DROP -------->",this.state.drop)

        let pickup = (this.state.pickup).split(',')
        let pickData = pickup.map((item => {
            let pickItem = parseFloat(item)

            return pickItem
        }))

        let drop = (this.state.drop).split(',')
        let dropData = drop.map((item => {
            let dropItem = parseFloat(item)

            return dropItem
        }))

        await axios.post('http://localhost:5001/assignCabDriver', {
            userID: this.state.userData['data']['_id'],
            pickUpCoordinate: pickData,
            dropCoordinate: dropData,
            getList: false
        }).then(res => {
            if (res && res.data && res.data.success && res.data['data']) {
                this.setState({
                    availableCab: res.data['data']
                })

                alert('Taxi Booked')
                this.setState({
                    isTaxiBooked: true
                })
                // localStorage.setItem('bookedRide', true)
            }
            else {
                alert('No Cab Near By')
            }
        }).catch(err => {
            alert(err.message)
            console.log("ERR ------>", err)
        })
    }

    async startTrip() {
        let rideID = localStorage.getItem('bookedRideID')
        await axios.post('http://localhost:5001/startRide', {
            rideID: rideID
        }).then(res => {
            console.log('RES ---->', res)
            this.setState({
                isStartTrip: true
            })
        }).catch(err => console.log('ERR ----->', err))
    }

    async endTrip() {
        let rideID = localStorage.getItem('bookedRideID')
        await axios.post('http://localhost:5001/endRide', {
            rideID: rideID
        }).then(res => {
            console.log('RES ---->', res)
            this.setState({
                isStartTrip: false
            })
            this.setState({
                endTrip: true
            })
        }).catch(err => console.log('ERR ----->', err))
    }






    render() {

        const { userData, availableCab, isTaxiBooked, bookedCabData, isStartTrip, endTrip } = this.state

        return (

            <>
                {
                    userData && userData['data'] && userData['data']['role'] === 'user' && (
                        <>
                            <button><Link to='/historyRides'>Rides History</Link></button>
                            <div style={{ margin: 5, padding: 5 }}>
                                <h3>{isTaxiBooked ? 'Booked Ride' : 'Book rides'}</h3>
                                {
                                    !isTaxiBooked && (
                                        <>
                                            <div>
                                                <input placeholder='Pickup Coordinates' name={'pickup'} onChange={(e) => this.onChange(e)} />
                                                <input placeholder='Destination Coordinates' name={'drop'} onChange={(e) => this.onChange(e)} />
                                            </div>
                                            <div>
                                                <button onClick={() => this.bookTaxi()}>Book Cab</button>
                                            </div>
                                        </>
                                    )
                                }

                                {
                                    isTaxiBooked && availableCab && (
                                        <>
                                            <div>
                                                <h2>Cab Distance</h2>
                                                <h3>{availableCab.cabDriverBestRide['cabDistance']}</h3>
                                                <h2>Driver Mobile</h2>
                                                <h3>{availableCab.cabDriverBestRide['mobile']}</h3>
                                                <h2>Vehicle No.</h2>
                                                <h3>{availableCab.cabDriverBestRide['vehicleReg']}</h3>
                                                <h2>OTP</h2>
                                                <h3>{availableCab.cabDriverBestRide['OTP']}</h3>
                                                <h2>Estimated Fare</h2>
                                                <h3>{Math.floor(availableCab.rideData['totalPrice'])}</h3>
                                            </div>
                                        </>
                                    )
                                }

                                {
                                    isTaxiBooked && !availableCab && (
                                        <>
                                            <h1>Booking Is Ongoing Please Click On History Ride</h1>
                                        </>
                                    )
                                }
                            </div>
                        </>
                    )
                }

                {
                    !bookedCabData && userData && userData['data'] && userData['data']['role'] === 'cabDriver' && (
                        <>
                            <h3>Switch For Rides</h3>
                            <Switch checkedChildren="Available" unCheckedChildren="Not Available" />
                            <h1>You Will Notify When You Received Your Ride</h1>
                        </>
                    )
                }

                {
                    bookedCabData && userData && userData['data'] && userData['data']['role'] === 'cabDriver' && (
                        <>
                            <h2>Your Got New Booking</h2>
                            <h2>Pick Up Coordinates</h2>
                            <h3>{bookedCabData['pickupCoordinate'][0] + ', ' + bookedCabData['pickupCoordinate'][1]}</h3>
                            <h2>Estimated Fare</h2>
                            <h3>{Math.floor(bookedCabData['totalPrice'])}</h3>
                            {
                                isStartTrip && !endTrip && (
                                    <h2 style={{ color: 'red' }}>Trip is InProgress</h2>
                                )
                            }
                            {
                                !isStartTrip && endTrip && (
                                    <h2 style={{ color: 'red' }}>Trip has has been completed</h2>
                                )
                            }
                            {
                                !isStartTrip && !endTrip && (
                                    <button onClick={() => this.startTrip()}>Start Trip</button>
                                )
                            }
                            {
                                isStartTrip && !endTrip && (
                                    <button onClick={() => this.endTrip()}>EndTrip</button>
                                )
                            }
                        </>
                    )
                }
            </>
        )
    }
}



export default Home