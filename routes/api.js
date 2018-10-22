const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  router.post('/signup', function (req, res, next) {
    passport.authenticate('signup', function (err, user, info) {
      if (err) { return next(err); }

      return res.json(info)
    })(req, res, next);
  });

  router.post('/signin', function (req, res, next) {
    passport.authenticate('signin', function (err, user, info) {
      if (err) { return next(err); }

      return res.json(info)
    })(req, res, next);
  });

  return router
}