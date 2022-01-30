// settin as testing environment
process.env.NODE_ENV = 'testing';

// imports  
const request = require('supertest');
const app = require('../app');
const Account = require('../components/account/account.model');
const database = require('./fixtures/database')
var expect = require('chai').expect;

// initialize db before running test
// before(async () => {
//     await database.connect()
//     await database.clearDatabase()
// });



// // after db before running test
// after(async () => await database.clearDatabase() && await database.disconnect());