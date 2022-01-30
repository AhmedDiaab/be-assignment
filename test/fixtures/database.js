// imports
const { ObjectId } = require("mongoose").Types;
const { sign } = require("jsonwebtoken");
const mongoose = require("mongoose");
require("dotenv").config();

// models
const Check = require("../../components/check/check.model");
const Progress = require("../../components/progress/progress.model");
const Report = require("../../components/report/report.model");

// creating test accounts
const accountsIds = [new ObjectId(), new ObjectId()];
const accounts = [
  {
    _id: accountsIds[0],
    email: "zhsjeaumrw@bestparadize.com",
    password: "testpass1",
    verificationToken: sign(
      { _id: accountsIds[0] },
      process.env.MAIL_TOKEN_SECRET
    ),
  },
  {
    _id: accountsIds[1],
    email: "qlli7oa5lj@kjkszpjcompany.com",
    password: "testpass2",
    verificationToken: sign(
      { _id: accountsIds[1] },
      process.env.MAIL_TOKEN_SECRET
    ),
  },
];

const passwords = [
  {
    currentPassword: accounts[0].password,
    newPassword: "testChanged1"
  }, {
    currentPassword: accounts[1].password,
    newPassword: "testChanged2"
  }
]

// creating sample checks
const checkIds = [new ObjectId(), new ObjectId()];

const checks = [
  {
    _id: checkIds[0],
    name: "first one",
    url: "127.0.0.1",
    port: "8080",
    protocol: "HTTP",
    account: accountsIds[0],
    tags: ["TestTag1"]
  },
  {
    _id: checkIds[1],
    name: "second one",
    url: "fast.com",
    protocol: "HTTPS",
    account: accountsIds[1],
    tags: ["TestTag2"]

  },
];

// creating sample progress
const progressIds = [new ObjectId(), new ObjectId()];

const progresses = [
  {
    _id: progressIds[0],
    check: checkIds[0],
  },
  {
    _id: progressIds[1],
    check: checkIds[1],
  },
];

// creating sample reports
const reportIds = [new ObjectId(), new ObjectId()];

const reports = [
  {
    _id: reportIds[0],
    account: accountsIds[0],
    check: checkIds[0],
    status: "Up",
    tags: ["testTag1", "testTag2"]
  },
  {
    _id: reportIds[1],
    account: accountsIds[1],
    check: checkIds[1],
    status: "Up",
    tags: ["testTag4", "testTag3"]
  },
];

// connect to db
const connect = async () => {
  mongoose.connect(process.env.TEST_DATABASE_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
};

// disconnect, drop database and close connection
const disconnect = async () => {
  await mongoose.disconnect()
};

// clear the database
const clearDatabase = async () => {
  await mongoose.connection.dropDatabase() 
};

module.exports = {
  connect,
  disconnect,
  clearDatabase,
  accounts,
  checks,
  progresses,
  reports,
  passwords
};
