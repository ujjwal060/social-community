import passport from 'passport';

export const appleAuth = (req, res, next) => {
  passport.authenticate('apple', {
    scope: ['name', 'email'],
  })(req, res, next);
};

export const appleCallback = (req, res, next) => {
  passport.authenticate('apple', { failureRedirect: '/' }, (err, user) => {
    if (err || !user) {
      return res.status(500).json({ message: 'Authentication failed' });
    }
    res.redirect('/profile');
  })(req, res, next);
};
