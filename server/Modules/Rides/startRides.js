const UserRides = require("../../Model/UserRides")
var ObjectId = require('mongodb').ObjectId;

async function StartRide(req, res) {
    try {
        const { rideID, OTP } = req.body

        if (!rideID) {
            res.status(400).send({
                success: false,
                message: 'Invalid Ride ID !!!',
            })
            return 0
        }

        // let rideData = await UserRides.findById(rideID)

        if (true) {
            let rideData = await UserRides
                .updateOne({ _id: rideID }, { $set: { status: 'InProgress', pickedUpStamp: +new Date } })

            res.status(200).send({
                success: true,
                message: 'Your trip has been started !!!',
                data: rideData
            })
        }

        else {
            res.status(400).send({
                success: false,
                message: 'OTP Incorrect !!!'
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
    StartRide: StartRide
}