import * as googleAuthService from '../services/googleAuthService';
import * as appleAuthService from '../services/appleAuthService';

export const googleLogin = (req, res, next) => {
  googleAuthService.googleAuth(req, res, next);
};

export const googleCallback = (req, res, next) => {
  googleAuthService.googleCallback(req, res, next);
};

export const appleLogin = (req, res, next) => {
  appleAuthService.appleAuth(req, res, next);
};

export const appleCallback = (req, res, next) => {
  appleAuthService.appleCallback(req, res, next);
};
