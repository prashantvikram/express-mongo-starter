const express = require('express');
const router = express.Router();
var passport = require("passport");

// middleware for jwt
router.use(function (req, res, next) {
  // authenticate using jwt
  next()
});

/**
 * adding a new user to the database
 */
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

module.exports = router;