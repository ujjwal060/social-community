import twilio from 'twilio';
import loadConfig from '../config/loadConfig.js';

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTP = async (mobile, otp) => {
    try {
        const config = await loadConfig();

        const accountSid = config.twilio_account_sid;
        const authToken = config.twilio_auth_token;
        const client = twilio(accountSid, authToken);

        await client.messages.create({
            body: `Your verification code is ${otp}. It will expire in 10 minutes.`,
            from: config.twilio_phone_number,
            to: mobile,
        });
        return { success: true };
    } catch (error) {
        return { success: false, message: [error.message] };
    }
};

export {
    generateOTP,
    sendOTP
}