const UserRides = require("../../Model/UserRides")
const User = require("../../Model/User")
var ObjectId = require('mongodb').ObjectId;

async function BookeRide(req, res) {
    try {
        const { userID, cabDriverID, pickUpCoordinate, dropCoordinate, duration, isPeekHrs,  totalPrice } = req.body

        if (!userID || !cabDriverID || !pickUpCoordinate || !dropCoordinate || !duration || !isPeekHrs ||!totalPrice) {
            res.status(400).send({
                success: false,
                message: 'Data Insufficient To Book, Please Check !!!',
            })
            return 0
        }

        let cabDriverData = await User.findById(cabDriverID)

        let rideData = await UserRides.create({
            userID: userID, 
            cabDriverID: cabDriverID, 
            pickUpCoordinate: pickUpCoordinate, 
            dropCoordinate: dropCoordinate, 
            duration: duration, 
            isPeekHrs: isPeekHrs,  
            totalPrice: totalPrice,
            status: 'booked'
        })

        res.status(200).send({
            success: true,
            message: 'Ride Has Been Successfully Booked',
            data: {
                rideData,
                cabDriverData
            }
        })

    }
    catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something Went Wrong!!!'
        })
    }
}

module.exports = {
    BookeRide: BookeRide
}