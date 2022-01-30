// settin as testing environment
process.env.NODE_ENV = "testing";

// imports
const request = require("supertest");
const app = require("../app");
const database = require("./fixtures/database");
var expect = require("chai").expect;

var token;

// initialize db before running test
before(async function() {
  await database.connect();
});

describe("Checks", () => {
  var response;

  // getting auth token
  beforeEach(async function() {
    response = await request(app)
      .post("/api/v1/login")
      .send({
        ...database.accounts[0],
      });

      token = response.body.data.accessToken;

  })


  it("user can create checks", async () => {
      response = await request(app)
      .post('/api/v1/check')
      .send({
          ...database.checks[0]
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  })

  it("user can get checks", async () => {
    response = await request(app)
    .get('/api/v1/check')
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

    expect(response.body.data.length).to.equal(1)
  })

  it("user can get check by id", async () => {
    response = await request(app)
    .get(`/api/v1/check/${database.checks[0]._id}`)
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    expect(response.body.data.name).to.equal(database.checks[0].name)
  })

  it("user can get checks by tags ", async () => {
    response = await request(app)
    .get(`/api/v1/check?tags[0]=${database.checks[0].tags[0]}`)
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    expect(response.body.data.length).to.equal(1)
  })

  it("user can delete check by id ", async () => {
    response = await request(app)
    .delete(`/api/v1/check/${database.checks[0]._id}`)
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  })
});

// after db before running test
after(async () => await database.clearDatabase() && await database.disconnect());
