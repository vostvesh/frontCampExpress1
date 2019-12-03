const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user));
});

passport.use(new LocalStrategy(async (username, password, done) => {
  let user = null;
  try {
    user = await User.findOne({ username });
  } catch (err) {
    return done(err);
  }
  if (!user) {
    return done(null, false, { message: 'Incorrect username' });
  }
  if (!user.validatePassword(password)) {
    return done(null, false, { message: 'Incorrect password' });
  }
  return done(null, user);
}));

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientId,
  clientSecret: config.facebook.clientSecret,
  callbackURL: 'http://localhost:5000/auth/facebook/callback'
},
(accessToken, refreshToken, profile, done) => {
  done(null, user);
}
));
