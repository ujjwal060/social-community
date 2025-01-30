import express from 'express';
import * as socialController from '../controllers/socialController';

const router = express.Router();

router.get('/google', socialController.googleLogin);

router.get('/google/callback', socialController.googleCallback);

router.get('/apple', socialController.appleLogin);

router.post('/apple/callback', socialController.appleCallback);

export default router;
