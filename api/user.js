const express = require('express');
const router = express.Router();
var User = require('../models/user');

// middleware for jwt
router.use(function (req, res, next) {
  // authenticate using jwt
  next()
})

/**
 * adding a new user to the database
 */
router.post('/signup', function (req, res, next) {
  // if the input field names in the form are the same as in the schema
  // you can simply pass the body in req to craete a new User object.

  let newUser = new User(req.body);

  newUser.save((err, user) => {
    if (err) {
      res.send(err);
    }
    else{
      res.json(user.id);
    }
  })
});

router.post('/signin', function (req, res, next) {

  // use regex to determine if user attempted to log in
  // using their email or username
  const usernameRegex = /^[a-zA-Z0-9_]*$/;
  
  var findInColumn = usernameRegex.test(req.body.username) ? 'username' : 'email';

  User.findOne({ findInColumn: req.body.username }, (err, user) => {
    if (err) {
      return res.status(404).send(err);
    }
    if (!user) {
      return res.status(404).json({
        message: "user does not exist",
        name: "UserNotFound"
      });
    }
    if (!user.validatePassword(req.body)){
      return res.status(404).json({
        message: "incorrect password",
        name: "IncorrectPassword"
      });
    }
    return res.status(200).send(user);
  });
});

module.exports = router;