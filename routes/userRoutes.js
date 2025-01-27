import express from 'express';
import { validateRequest } from '../middleware/validationMiddleware.js';
import {
    userValidationSchema,
    loginValidationSchema,
    setPasswordValidationSchema,
    userValidationSchemaOTP
} from '../validators/userValidator.js';
import {
    registerUser,
    loginUser,
    forgatePassword,
    resendOtp,
    logOut,
    setPassword,
    changePassword,
    verifyOtp,
} from '../controllers/userController.js';
import {
    authenticateUser,
    refreshToken
} from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/signup', validateRequest(userValidationSchema), registerUser);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.post('/forgot-password', forgatePassword);
router.post('/set-password', validateRequest(setPasswordValidationSchema), setPassword)
router.post('/resend-otp', resendOtp);
router.post('/logout', authenticateUser, logOut);
router.post('/changePassword', authenticateUser, validateRequest(setPasswordValidationSchema), changePassword);
router.post('/verifyOTP', validateRequest(userValidationSchemaOTP),verifyOtp);
router.post('/refreshToken', refreshToken);

export default router;