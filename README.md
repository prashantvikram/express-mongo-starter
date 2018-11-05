# express-mongo-starter
A starter-kit for an express server along with API routes and using MongoDB as database. It includes
* env variables for server side globals like PORT, MONGO URI etc.
* joi to validate server side variables
* winston logger along with morgan
* passport for authentication and session creation
* connect-mongo for session store
* exress-rate-limit to rate-limit api/ routes

## todo

* jest for testing authentication and api routes
* support for automated mails using nodemailer
* some way of organized error handling and reporting to the front-end
  e.g. error from not meeting the criteria in mongoose schema (regex, max char limit, etc.)
  e.g. error returned by passport's message
  e.g. othergeneral errors like 404, 500 etc.