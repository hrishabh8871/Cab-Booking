const User = require("../../Model/User")

async function UserLoginRegister(req, res) {
    try {
        const { mobile, isCabLogin } = req.body

        let OTP = 12345


        // console.log("MOBILE LENGTH ---->", /^[1-9]{1}[0-9]{9}$/.test(mobile.value))

        if (!mobile) {
            res.status(400).send({
                success: false,
                message: 'Mobile Number Must Be 10 Digits!!!',
            })
            return 0
        }

        let isUserDataPresent = await User.findOne({ mobile: mobile })

        if (isUserDataPresent) {
            await User.updateOne({ mobile: mobile }, { $set: { OTP: OTP } })
        }
        else {
            
            await User.create({
                mobile: mobile,
                OTP: OTP,
                role: isCabLogin ? 'cabDriver' : 'user',
            })
        }

        res.status(200).send({
            success: true,
            message: 'User Validate & Otp Sent To Your Mobile Number!!!',
            isCabDetailsNeedsToRegister: (!isUserDataPresent && isCabLogin) || (isUserDataPresent && isUserDataPresent['role'] === 'cabDriver' && !isUserDataPresent['DL'] && !isUserDataPresent['vehicleReg']) ? true : false
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
    UserLoginRegister: UserLoginRegister
}