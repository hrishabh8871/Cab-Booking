const express = require("express");
const router = express.Router();
const { UserLoginRegister, OtpVerification } = require('../Modules/Auth/index.js');
const { AssignCabDriver, EndRide, StartRide } = require("../Modules/Rides/index");
const { getRidesDetailsByUser } = require('../Modules/User/index');

router.post('/userValidate', UserLoginRegister)
router.post('/otpVerification', OtpVerification)
router.post('/getRidesDetailsByUser', getRidesDetailsByUser)
router.post('/assignCabDriver', AssignCabDriver)
router.post('/endRide', EndRide)
router.post('/startRide', StartRide)

// Export All Routers
module.exports = router