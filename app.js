// the file that contains routes and configuration for express
const express = require('express')
const routes = require('./routes');
const app = express();
const ErrorHandler = require('./handlers/ErrorHandler')
require('dotenv').config()
// use middleware to parse json
app.use(express.json());

// use passport
require('./middlewares/passport')

// use imported routes that grouped together in routes.js file
app.use("/api/v1",routes)

// error handling
app.use(ErrorHandler);

module.exports = app;