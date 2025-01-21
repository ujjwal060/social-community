// import twilio from 'twilio';

// const accountSid = 'your_twilio_account_sid'
// const authToken = 'your_twilio_auth_token';
// const client = twilio(accountSid, authToken);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// const sendOTP = async (mobile, otp) => {
//     try {
//         await client.messages.create({
//             body: `Your verification code is ${otp}. It will expire in 10 minutes.`,
//             from: 'your_twilio_phone_number',
//             to: mobile,
//         });
//         return true;
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         return false;
//     }
// };

export {
    generateOTP,
    // sendOTP
}