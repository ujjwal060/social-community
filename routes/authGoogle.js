import express from "express";
import passport from "passport";
import { logger } from "../utils/logger.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    try {
      if (!req.user) {
         logger.warn("Google login failed: User not found.");
        return res.status(404).json({
          status: 404,
          message: ["User not found with the provided email . Please check the details and try again."]
        });
      }

      const { user, accessToken, refreshToken } = req.user;
      logger.info(`Google login successful for user: ${user.email}`);

      return res.status(200).json({
        status: 200,
        message: ["Login successful"],
        data: {
          user,
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      logger.error(`Google login error: ${error.message}`);
      return res.status(500).json({
        status: 500,
        message: [error.message]
      });
    }
  }
);

export default router;
