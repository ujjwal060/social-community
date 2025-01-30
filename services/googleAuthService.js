import passport from 'passport';

export const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

export const googleCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
    if (err || !user) {
      return res.status(500).json({ message: 'Authentication failed' });
    }
    res.redirect('/profile');
  })(req, res, next);
};
