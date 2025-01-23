import twilio from 'twilio';

const accountSid = process.env.twilio_account_sid;
const authToken =  process.env.twilio_auth_token;
const client = twilio(accountSid, authToken);

const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

const sendOTP = async (mobile, otp) => {
    try {
        await client.messages.create({
            body: `Your verification code is ${otp}. It will expire in 10 minutes.`,
            from:process.env.twilio_phone_number,
            to: mobile,
        });
        return true;
    } catch (error) {
        return { success: false, message:[error.message]};
    }
};

export {
    generateOTP,
    sendOTP
}