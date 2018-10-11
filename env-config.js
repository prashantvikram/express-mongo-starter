const envVar = require('dotenv').config();
const joi = require("joi");

if (envVar.error){
  throw envVar.error;
}

const envVarchema = joi.object().keys({
  NODE_ENV: joi.string()
    .valid(['development', 'production', 'test'])
    .required(),
  PORT: joi.number()
    .required(),
  LOGGER_LEVEL: joi.string()
    .valid(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
});

const { error, value: envVarParsed } = joi.validate(envVar.parsed, envVarchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  port: envVarParsed.PORT,
  dev: envVarParsed.NODE_ENV,
  level: envVarParsed.LOGGER_LEVEL
}

module.exports = config;