// imports 
const request = require('supertest');
const app = require('../app');
const Account = require('../components/account/account.model');
const {initDatabase, accounts} = require('./fixtures/database')

// initialize db
beforeEach(initDatabase);

// user can register
describe('User can register',() => {
    var response
    // send post request
    it('should send post request register endpoint',async () => {
        response = await request(app)
        .post('/api/v1/register')
        .send({
            ...accounts[0]
        }).expect(200)
    })

    3
    

    // const account = await Account.findOne({_id: response.body.data._id})
    // expect(account).not.toBeNull()

    // expect(response.body.data.email).toBe(accounts[0].email);

    // expect(response.body).toMatchObject({
    //     status: "success",
    //     data: {
    //         email: account[0].email
    //     }
    // });
})

// // user can login
// describe('User can login', () => {
//     it('should test that true === true', () => {
//         expect(true).toBe(true)
//     })
// })

// // user can login without activate account
// describe('User can login without activate account', () => {
//     it('should test that true === true', () => {
//         expect(true).toBe(true)
//     })
// })

// // user can activate account
// describe('User can activate account', () => {
//     it('should test that true === true', () => {
//         expect(true).toBe(true)
//     })
// })


// // user can update password
// describe('User can update password', () => {
//     it('should test that true === true', () => {
//         expect(true).toBe(true)
//     })
// })