var express       = require("express");
var createError   = require('http-errors')[404];
var exphbs        = require('express-handlebars');
var compression   = require("compression");
var morgan        = require("morgan");
var winston       = require('./config/winston');
var helmet        = require("helmet");

const app = express();

app.use(helmet());

// middleware

/**
 * suggested by express to decrease the size
 * of the response body
 */
app.use(compression());


//set view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'default',
  // helpers: require("./public/js/handlebar-helpers.js").helpers,
  partialsDir: "views/partials/",
  layoutsDir: "views/layouts/"
}));
app.set('view engine', 'handlebars');

// logging
app.use(morgan('combined', { stream: winston.stream }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app
