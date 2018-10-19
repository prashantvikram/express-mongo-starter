const express = require('express');
const router = express.Router();

// middleware for jwt
router.use(function (req, res, next) {
  // authenticate using jwt
  next()
});

/**
 * adding a new user to the database
 */
router.post('/', function (req, res, next) {
  return res.status(200).json("data");
});


module.exports = router;