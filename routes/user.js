const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  router.get('/', function(req, res, next) {
    res.json(req.session)
  });

  router.post('/signup', function (req, res, next) {
    passport.authenticate('signup', function (err, user, info) {
      if (err) { return next(err); }

      return res.json(info)
    })(req, res, next);
  });

  router.post('/signin', function (req, res, next) {
    passport.authenticate('signin', function (err, user, info) {
      if (err) { return next(err); }
      req.login(user, err => {
        if (err) { return next(err); }

        return res.json(info)
      });
    })(req, res, next);
  });

  router.post('/logout', function (req, res, next) {
    req.logout();
    res.json({message: "logged out successfully"});
  });

  return router;
}