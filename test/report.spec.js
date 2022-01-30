// settin as testing environment
process.env.NODE_ENV = "testing";

// imports
const request = require("supertest");
const app = require("../app");
const database = require("./fixtures/database");
var expect = require("chai").expect;
const Report = require('./fixtures/report')

var token;

// initialize db before running test
before(async function () {
  await database.connect();
});

describe("Reports", () => {
  var response;

  // getting auth token
  beforeEach(async function () {
    response = await request(app)
      .post("/api/v1/login")
      .send({
        ...database.accounts[0],
      });
    await Report.createReport(0)
    token = response.body.data.accessToken;
  });

  it("user can get reports", async () => {
    response = await request(app)
    .get('/api/v1/report')
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

    expect(response.body.data.length).to.equal(1)
  });

  it("user can get reports by tags", async () => {
    response = await request(app)
    .get(`/api/v1/report?tags[0]=${database.reports[0].tags[0]}`)
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)

    expect(response.body.data).not.null
  });

  it("user can delete reports", async () => {
    response = await request(app)
    .delete(`/api/v1/report/${database.reports[0]._id}`)
    .send()
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
  });
});

// after db before running test
after(
  async () => (await database.clearDatabase()) && (await database.disconnect())
);
