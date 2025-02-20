import bcrypt from 'bcrypt';
import { customAlphabet } from 'nanoid';
import UserModel from '../models/userModel.js';
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

export { hashPassword ,generateUniqueUserId,genrateReferral};