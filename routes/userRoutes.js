import express from 'express';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { userValidationSchema ,loginValidationSchema,setPasswordValidationSchema} from '../validators/userValidator.js';
import {
    registerUser,
    loginUser,
    forgatePassword,
    resendOtp,
    logOut,
    setPassword,
    changePassword
} from '../controllers/userController.js';


const router = express.Router();

router.post('/register', validateRequest(userValidationSchema), registerUser);
router.post('/login', validateRequest(loginValidationSchema), loginUser);
router.post('/forgot-password', forgatePassword);
router.post('/set-password', validateRequest(setPasswordValidationSchema), setPassword)
router.post('/resend-otp', resendOtp);
router.post('/logout', logOut);
router.post('/changePassword',validateRequest(setPasswordValidationSchema), changePassword);


export default router;