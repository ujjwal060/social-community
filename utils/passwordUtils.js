import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import UserModel from '../models/userModel.js';
import { logger } from './logger.js';
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 8);

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const generateUniqueUserId = async () => {
    let lastUser = await UserModel.findOne({}, { userId: 1 }).sort({ createdAt: -1 });

    let lastNumber = lastUser ? parseInt(lastUser.userId.split('-')[1]) : 1000;
    let newNumber = (lastNumber + 1) % 10000;
    if (newNumber < 1001) newNumber = 1001;

    let formattedId = `user-${String(newNumber).padStart(5, '0')}`;
    return formattedId;
};

const genrateReferral = async (name) => {
    let referralCode;
    let exists = true;
    const firstName = name.split(' ')[0].toLowerCase();

    while (exists) {
        referralCode = firstName + nanoid(5);
        exists = await UserModel.exists({ referralCode });
    }
    return referralCode;
};

const handleReferral=async(referralCode, newUserId)=>{
    logger.info("Checking referral code", { referralCode });
    const referrer = await UserModel.findOne({ referralCode });
    if (!referrer) {
        logger.warn("Invalid referral code used", { referralCode });
        throw new Error("Invalid referral code");
    }

    logger.info("Valid referral code. Updating referrer referrals list", {
        referrerId: referrer.userId,
        newUserId,
    });

    await UserModel.updateOne(
        { userId: referrer.userId },
        { $push: { referrals: newUserId } }
    );

    logger.info("Referral process completed successfully", {
        referrerId: referrer.userId,
        newUserId,
    });

    return referrer.userId;
}

export { hashPassword ,generateUniqueUserId,genrateReferral,handleReferral};