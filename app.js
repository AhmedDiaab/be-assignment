// the file that contains routes and configuration for express
const express = require('express')
const routes = require('./routes');
const app = express();

// use middleware to parse json
app.use(express.json());

// use imported routes that grouped together in routes.js file
app.use(routes)


module.exports = app;