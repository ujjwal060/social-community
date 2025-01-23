import UserModel from '../models/userModel.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { generateOTP,sendOTP } from '../utils/otpUtils.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, state, city, gender, password } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 400,
                message: ['Email already registered. Please use a different email.'],
            });
        }

        const hashedPassword = await hashPassword(password);
        const otp = generateOTP();

        const user = new UserModel({
            name,
            email,
            mobile,
            state,
            city,
            gender,
            password: hashedPassword,
            otp,
            otpExpire: new Date(Date.now() + 10 * 60 * 1000),
        });

        await user.save();

        const otpSent = await sendOTP(mobile, otp);

        if (!otpSent.success) {
            return res.status(500).json({
                status: 500,
                message: otpSent.message,
            });
        }
        return res.status(200).json({
            status: 200,
            message: ['User registered successfully. OTP sent to mobile.'],
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const verifyOtp=async(req,res)=>{
    try{

    }catch(error){
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });  
    }
}

export {
    registerUser,
    verifyOtp,
};