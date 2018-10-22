var express       = require("express");
var createError   = require('http-errors')[404];
var compression   = require("compression");
var morgan        = require("morgan");
var winston       = require('./config/winston');
var helmet        = require("helmet");
var bodyParser    = require("body-parser");
var fs            = require("fs");
var mongoose      = require("mongoose");
var passport      = require("passport");
var session       = require("express-session");
var rateLimit     = require("express-rate-limit");
const MongoStore  = require('connect-mongo')(session);

const DB_URL      = require("./config/env-config").mongoUrl;
const SECRET      = require("./config/env-config").sessionSecret;

const app = express();
require("./config/passport-config")(passport);

// connect to database
mongoose.connect(DB_URL,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }, (err) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log("Database connected");
    }
  }
);


// logging
app.use(morgan('combined', { stream: winston.stream }));

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

//dynamically include routes from api
fs.readdirSync('./routes').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    let route = require('./routes/' + file)(passport);
    app.use(`/${file.split(".")[0]}`, route);
  }
});

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 2 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
  handler: function (req, res) {
    // handle requests when limit is reached
    // could be logged using winston
    // or saved to a redis store
  }
});

app.use("/api/", apiLimiter);

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
