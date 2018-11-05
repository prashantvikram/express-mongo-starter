const express = require('express');
const router = express.Router();

module.exports = function(passport) {
  isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
      return next();
    }
    else{
      return res.status(401).json({
        message: "Unauthenticated"
      })
    }
  }

  router.get('/', isAuthenticated, function (req, res, next) {
    res.json({
      data: 1
    })
  });

  router.post('/', function (req, res, next) {
    // perform post action

    return res.status(200).json({
      message: "Posted"
    })
  });

  return router
}