var express       = require("express");
var createError   = require('http-errors')[404];
var compression   = require("compression");
var morgan        = require("morgan");
var winston       = require('./config/winston');
var helmet        = require("helmet");
var bodyParser    = require("body-parser");
var fs            = require("fs");
var mongoose      = require("mongoose");
const DB_URL      = require("./config/env-config").mongoUrl;

const app = express();

app.use(helmet());

// middleware
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to database
mongoose.connect(DB_URL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Database connected");
  }
});

// logging
app.use(morgan('combined', { stream: winston.stream }));

//dynamically include routes from api
fs.readdirSync('./api').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    let route = require('./api/' + file);
    app.use(`/${file.split(".")[0]}`, route);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(err.status || 500).json({
    message: err.message
  });
});

module.exports = app
