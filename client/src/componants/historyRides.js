// Import Library
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { Switch } from 'antd';
import './index.css'
import axios from 'axios';
import moment from 'moment'



class HistoryRides extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            ridesData: null,
        };
    }



    async componentDidMount() {
        console.log("HOSTIRY RIDES")

        try {

            let loggedInUserData = JSON.parse(localStorage.getItem('userIDRider'))

            console.log("LOGGEDINUSER ------>", loggedInUserData)

            this.setState({
                userData: loggedInUserData
            })

            await axios.post('http://localhost:5001/getRidesDetailsByUser', {
                userID: loggedInUserData.data['_id']
            }).then(res => {
                if (res && res.data && res.data.data) {
                    console.log("RES --------->", res.data['data'])
                    this.setState({
                        ridesData: res.data['data']
                    })
                }
            }).catch(err => console.log("ERROR ----->", err))





        } catch (err) {

        }

    }






    render() {

        const { userData, ridesData } = this.state

        return (

            <>
                <table class='table'>
                    <tr>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Pickup</th>
                        <th>Drop</th>
                        <th>Cab No.</th>
                        <th>Booked On</th>
                    </tr>
                    {
                        ridesData && ridesData.length > 0 ?
                            
                                ridesData.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>{Math.floor(item['totalPrice'])}</td>
                                            <td>{item['status']}</td>
                                            <td>{item['pickupCoordinate'][0] + ', ' + item['pickupCoordinate'][1]}</td>
                                            <td>{item['dropCoordinate'][0] + ', ' + item['dropCoordinate'][1]}</td>
                                            <td>{item['cabDriverID']['vehicleReg']}</td>
                                            <td>{moment(item['createdAt']).format('HH:MM:SS')}</td>
                                        </tr>
                                    )
                                })
                            
                        : <h3>No Rides Found</h3>
                    }
                </table>

            </>
        )
    }
}



export default HistoryRides