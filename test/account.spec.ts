// settin as testing environment
process.env.NODE_ENV = 'testing';

// imports  
const request = require('supertest');
const app = require('../app');
const Account = require('../components/account/account.model');
const database = require('./fixtures/database')
var expect = require('chai').expect;

// initialize db before running test
before(async () => {
    await database.connect()
    await database.clearDatabase()
});

// user can register
describe('User', () => {
    var response
    var token
    // send post request
    it('can register by sending post request to register endpoint.', async () => {
        response = await request(app)
        .post('/api/v1/register')
        .send({
            ...database.accounts[0]
        }).expect(200)
    })

    it('should be saved in database', async () => {
        const account = await Account.findOne({_id: response.body.data.account._id})
        expect(account).to.not.be.null
    })

    it('can login by sending post request to login endpoint.', async () => {
        response = await request(app)
        .post('/api/v1/login')
        .send({
            ...database.accounts[0]
        }).expect(200)
        token = response.body.data.accessToken
    })

    it('can update password.', async () => {
        response = await request(app)
        .post('/api/v1/account/pass')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ...database.passwords[0]
        }).expect(200)
        
    })

    it('can get account data', async () => {
        response = await request(app)
        .get('/api/v1/account')
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200)
    })

})

// after db before running test
after(async () => await database.clearDatabase() && await database.disconnect());