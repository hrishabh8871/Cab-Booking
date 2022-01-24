const UserRides = require("../../Model/UserRides")
const User = require("../../Model/User")
var ObjectId = require('mongodb').ObjectId;

async function EndRide(req, res) {
    try {
        const { rideID } = req.body

        if (!rideID) {
            res.status(400).send({
                success: false,
                message: 'Invalid Ride ID !!!',
            })
            return 0
        }

        let rideData = await UserRides.findById(rideID)

        if (rideData && rideData['dropCoordinate']) {
            await UserRides
                .updateOne({ _id: rideID }, { $set: { status: 'complete' } })

            await User
                .updateOne({ _id: rideData['cabDriverID'] }, { $set: { isAvailableForRide: true, cabCurrentCoordinate: { type: 'Point', coordinates: rideData['dropCoordinate'] } } })

            res.status(200).send({
                success: true,
                message: 'Your trip has been completed succesfully',
                data: rideData
            })
        }

        else {
            res.status(400).send({
                success: false,
                message: 'Invalid Ride !!!'
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