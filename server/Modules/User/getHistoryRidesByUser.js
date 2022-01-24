const UserRides = require("../../Model/UserRides")
var ObjectId = require('mongodb').ObjectId;

async function getRidesDetailsByUser(req, res) {
    try {
        const { userID } = req.body

        if (!userID) {
            res.status(400).send({
                success: false,
                message: 'Invalid User ID !!!',
            })
            return 0
        }

        let userRidesHistory = await UserRides
            .find({userID: ObjectId(userID)})
            .populate('userID')
            .populate('cabDriverID')

        if (userRidesHistory) {
            res.status(200).send({
                success: true,
                message: 'User Rides History',
                data: userRidesHistory
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: 'No Data Fount',
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
    getRidesDetailsByUser: getRidesDetailsByUser
}