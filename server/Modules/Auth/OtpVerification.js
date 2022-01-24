const User = require("../../Model/User")

async function OtpVerification(req, res) {
    console.log("OTP VERIFICATION")
    try {
        const { mobile, OTP, isCabDetails, cabDetails } = req.body

        console.log("BODY ----->", req.body)

        let isUserPresent = await User.findOne({ mobile: mobile })

        if ((isUserPresent && isUserPresent['OTP'] === OTP) || (isCabDetails && isUserPresent && isUserPresent['OTP'] === OTP && cabDetails && cabDetails['DL'] && cabDetails['vehicleReg'])) {

            User.updateOne({ mobile: mobile }, {
                $set: {
                    DL: cabDetails['DL'],
                    vehicleReg: cabDetails['vehicleReg'],
                    // insuranceExpireDate: cabDetails['insuranceExpireDate'],
                    // pollutionExpireDate: cabDetails['pollutionExpireDate']
                }
            })
            res.status(200).send({
                success: true,
                message: 'OTP Verified',
                data: isUserPresent
            })
        }
        else {
            res.status(400).send({
                success: false,
                message: !isCabDetails ? 'OTP Incorrect !!!' : 'OTP Incorrect Or Cab Details Missing !!!'
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
    OtpVerification: OtpVerification
}