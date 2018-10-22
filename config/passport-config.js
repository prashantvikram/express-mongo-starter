var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user');

module.exports = function (passport) {
  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },function (req, username, password, done) {
    User.findOne({$or: [{ 'username': username }, { 'email': req.body.email }]}, function (err, user) {
      if (err)
        return done(err);
      if (user) {
        return done(null, false, {message: "User with the same username/email exists"});
      } else {
        var newUser = new User(req.body);
        newUser.save(function (err) {
          if (err)
            return done(err);
          
          return done(null, newUser, { message: "User was added successfully"});
        });
      }
    });
  }));

  passport.use('signin', new LocalStrategy({
    passReqToCallback: true
  }, function (req, username, password, done) {
    User.findOne({$or: [{ 'username': username }, { 'email': username }]}, function (err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, { message: "No user found" });
      if (!user.validatePassword(password))
        return done(null, false, {message: 'Wrong password'});
        
      return done(null, user, {message: 'User logged in successfully'})
    });
  }));
}