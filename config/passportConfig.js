import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import AppleStrategy from 'passport-apple';
import User from '../models/userModel';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'social.providerId': profile.id, 'social.provider': 'google' });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          social: [
            {
              provider: 'google',
              providerId: profile.id,
            }
          ],
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
      callbackURL: process.env.APPLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ 'social.providerId': profile.id, 'social.provider': 'apple' });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          name: profile.name,
          email: profile.email,
          social: [
            {
              provider: 'apple',
              providerId: profile.id,
            }
          ],
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
