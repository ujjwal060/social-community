import jwt from "jsonwebtoken";
import UserModel from '../models/userModel.js';
import { hashPassword } from '../utils/passwordUtils.js';
import { generateOTP, sendOTP } from '../utils/otpUtils.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, state, city, gender, password } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });

        if (existingUser) {
            if (existingUser.email === email && existingUser.mobile === mobile) {
                return res.status(400).json({
                    status: 400,
                    message: ['Email and mobile are already registered. Please use a different email or mobile.'],
                });
            } else if (existingUser.email === email) {
                return res.status(400).json({
                    status: 400,
                    message: ['Email is already registered. Please use a different email.'],
                });
            } else if (existingUser.mobile === mobile) {
                return res.status(400).json({
                    status: 400,
                    message: ['Mobile number is already registered. Please use a different mobile number.'],
                });
            }
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

const verifyOtp = async (req, res) => {
    try {
        const { email, otp, type } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                status: 400,
                message: ["Email and OTP are required"],
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: ["User not found"],
            });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                status: 400,
                message: ["Invalid OTP"],
            });
        }

        const currentTime = new Date();
        if (user.otpExpire < currentTime) {
            return res.status(400).json({
                status: 400,
                message: ["OTP has expired"],
            });
        }

        if (type === 'register') {

            const accessToken = jwt.sign(
                { id: user._id, email: user.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );

            const refreshToken = jwt.sign(
                { id: user._id, email: user.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "30d" }
            );

            user.otp = null;
            user.otpExpire = null;
            user.refreshToken = refreshToken;
            await user.save();

            return res.status(200).json({
                status: 200,
                message: ["OTP verified successfully"],
                accessToken,
                refreshToken,
            });
        } else {
            user.otp = null;
            user.otpExpire = null;
            await user.save();

            return res.status(200).json({
                status: 200,
                message: ["OTP verified successfully. You can now reset your password."],
                data: user
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, mobile, password } = req.body;

        if (!password || (!email && !mobile)) {
            return res.status(400).json({
                status: 400,
                message: ["Email or Mobile and password are required"],
            });
        }

        const user = await UserModel.findOne({
            $or: [{ email }, { mobile }]
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: ["User not found with the provided email or mobile. Please check the details and try again."],
            });
        }

        const isPasswordValid = await comparePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: ["The password you entered is incorrect. Please check and try again."],
            });
        }

        const accessToken = jwt.sign(
            { id: user._id, email: user.email, mobile: user.mobile },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email, mobile: user.mobile },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "30d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: ["Login successful"],
            accessToken,
            refreshToken,
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const forgatePassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 400,
                message: ["Please provide a valid email address to proceed."],
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: ["Account not found with the provided email. Please check the email and try again."],
            });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const otpSent = await sendOTP(user.mobile, otp);

        if (!otpSent.success) {
            return res.status(500).json({
                status: 500,
                message: otpSent.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: ["OTP has been sent to your mobile."],
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const setPassword = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: ["Please provide email, and password to proceed."],
            });
        }

        const user = await UserModel.findOne({ email });

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: ["Your password has been updated successfully."],
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email, mobile } = req.body;

        if (!email && !mobile) {
            return res.status(400).json({
                status: 400,
                message: ["Please provide your registered email or mobile."],
            });
        }

        const user = await UserModel.findOne({
            $or: [{ email }, { mobile }]
        });

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: ["Account not found with the provided email or mobile. Please check and try again."],
            });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const otpSent = await sendOTP(user.mobile, otp);

        if (!otpSent.success) {
            return res.status(500).json({
                status: 500,
                message: otpSent.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: ["A new OTP has been sent to your registered mobile number"],
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const logOut = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: ["User not found"],
            });
        }

        user.refreshToken = null;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: ["Logout successful"],
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { password } = req.body;

        const user = await UserModel.findById(userId);

        const hashedPassword=await hashPassword(password);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            status: 200,
            message: ["Password changed successfully"],
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: [error.message],
        });
    }
}
export {
    registerUser,
    verifyOtp,
    loginUser,
    forgatePassword,
    setPassword,
    resendOtp,
    logOut,
    changePassword
};