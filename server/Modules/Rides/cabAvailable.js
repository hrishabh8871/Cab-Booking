const UserRides = require("../../Model/UserRides")
const User = require("../../Model/User")
var ObjectId = require('mongodb').ObjectId;

async function EndRide(req, res) {
    try {
        const { _id, isAvailable } = req.body

        if (!_id) {
            res.status(400).send({
                success: false,
                message: 'Invalid Ride ID !!!',
            })
            return 0
        }

        if (true) {

            await User
                .updateOne({ _id: _id }, { $set: { isAvailableForRide: !!isAvailable }})

            res.status(200).send({
                success: true,
                message: 'Your trip has been completed succesfully',
                data: rideData
            })
        }

        else {
            res.status(400).send({
                success: false,
                message: 'Invalid Cab Driver !!!'
            })
        }

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
    EndRide: EndRide
}