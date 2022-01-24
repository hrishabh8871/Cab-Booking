const UserRides = require("../../Model/UserRides")
const User = require("../../Model/User")
var ObjectId = require('mongodb').ObjectId;

async function AssignCabDriver(req, res) {
    try {
        const { userID, pickUpCoordinate, dropCoordinate, isPeekHrs, getList } = req.body

        // console.log("REQ ----->", req.body)

        if (!pickUpCoordinate) {
            res.status(400).send({
                success: false,
                message: 'Pick Up Cooridinate Missing !!!',
            })
            return 0
        }

        let isBookedData = await UserRides.find({
            $and: [
                {
                    $or: [
                        {"status":"booked"},
                        {"status":"InProgress"}
                    ]
                },
                {
                    userID: userID
                }
            ]
        })

        if(isBookedData.length > 0) {

            res.status(400).send({
                success: false,
                message: 'You Cannot Booked Cab You Already Booked Onces !!!'
            })

            return 0
        }

        let listOfAllNearByCab = await User.aggregate(
            [
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: pickUpCoordinate },
                        distanceField: "cabDistance",
                        $maxDistance: 150000,
                        spherical: true
                    }
                },
                { $match: { role: 'cabDriver', isAvailableForRide: true } },
            ])

        let cabDriverBestRide = await cabDriverBest(listOfAllNearByCab)

        if (getList) {
            res.status(200).send({
                success: true,
                message: 'List Of Near By cab',
                data: listOfAllNearByCab
            })
        }
        else if (cabDriverBestRide) {

            let totalPrice = await getTotalPriceByDistance(pickUpCoordinate, dropCoordinate)

            if(totalPrice) {
                let rideData = await UserRides.create({
                    userID: userID,
                    cabDriverID: cabDriverBestRide['_id'],
                    pickupCoordinate: pickUpCoordinate,
                    dropCoordinate: dropCoordinate,
                    totalPrice: totalPrice,
                    status: 'booked'
                })

                await User.updateOne({ _id: cabDriverBestRide['_id'] }, { $set: { "isAvailableForRide": false }})

                res.status(200).send({
                    success: true,
                    message: 'Assigned Cab',
                    data: {
                        cabDriverBestRide,
                        rideData
                    }
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    message: 'No Cab Found!!!'
                })
            }
        }

        else {
            res.status(500).send({
                success: false,
                message: 'Something Went Wrong!!!'
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
    AssignCabDriver: AssignCabDriver
}

async function cabDriverBest(listOfCab) {
    if (listOfCab && listOfCab.length > 0) {
        let cabDriverBestRide = listOfCab[0]
        return cabDriverBestRide
    }

    return false
}

async function getTotalPriceByDistance(pickUpCoordinate, dropCoordinate) {
    try {
        let distance = Math.sqrt(Math.pow((pickUpCoordinate[0] - dropCoordinate[0]), 2) + Math.pow((pickUpCoordinate[1] - dropCoordinate[1]), 2))

        let totalPrice = distance * 5

        return totalPrice
    } catch (err) {
        console.log("ERROR ----->", err)

        return false
    }
}