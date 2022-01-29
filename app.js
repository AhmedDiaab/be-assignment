// the file that contains routes and configuration for express
require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const app = express();
const ErrorHandler = require("./handlers/ErrorHandler");
const MailConsumer = require("./services/Queue/mail/consumer");
const CheckConsumer = require("./services/Queue/check/consumer");

// use middleware to parse json
app.use(express.json());

// use passport
require("./middlewares/passport");

// use imported routes that grouped together in routes.js file
app.use("/api/v1", routes);

app.get("/", (req, res, next) => {
  res.status(200).send("success");
});

// error handling
app.use(ErrorHandler);

// mail queue consumer
MailConsumer.init();

// check queue consumer
CheckConsumer.init();

module.exports = app;
