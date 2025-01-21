import express from 'express';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { userValidationSchema } from '../validators/userValidator.js';
import {registerUser} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', validateRequest(userValidationSchema),registerUser);

export default router;