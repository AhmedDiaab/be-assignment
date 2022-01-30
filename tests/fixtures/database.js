// imports
const {ObjectId} = require('mongoose').Types
const {sign} = require('jsonwebtoken')

// models
const Account = require('../../components/account/account.model')
const Check = require('../../components/check/check.model')
const Progress = require('../../components/progress/progress.model')
const Report = require('../../components/report/report.model')

// creating test accounts
const accountsIds = [new ObjectId(), new ObjectId()]
const accounts = [{
    _id: accountsIds[0],
    email: "zhsjeaumrw@bestparadize.com",
    password: "testpass1",
    verificationToken: sign({ _id :accountsIds[0]  }, process.env.MAIL_TOKEN_SECRET)
},{
    _id: accountsIds[1],
    email: "qlli7oa5lj@kjkszpjcompany.com",
    password: "testpass2",
    verificationToken: sign({ _id :accountsIds[1]  }, process.env.MAIL_TOKEN_SECRET)
}]

// creating sample checks 
const checkIds = [new ObjectId(), new ObjectId()]

const checks = [{
    _id: checkIds[0],
    name: "first one",
    url: "fast.com",
    protocol: "HTTPS",
    account: accountsIds[0]
}, {
    _id: checkIds[1],
    name: "second one",
    url: "fast.com",
    protocol: "HTTPS",
    account: accountsIds[1]
}]

// creating sample progress
const progressIds = [new ObjectId(), new ObjectId()]

const progresses = [{
    _id: progressIds[0],
    check: checkIds[0]
}, {
    _id: progressIds[1],
    check: checkIds[1]
}]

// creating sample reports 
const reportIds = [new ObjectId(), new ObjectId()]

const reports = [{
    _id: reportIds[0],
    account: accountsIds[0],
    check: checkIds[0],
    status: "Up"
}, {
    _id: reportIds[1],
    account: accountsIds[0],
    check: checkIds[0],
    status: "Up"
}]

// ensure db is empty and this data created
const initDatabase = async () => {
    await Account.deleteMany();
    await Check.deleteMany();
    await Report.deleteMany();
    await Progress.deleteMany();
    await Promise.resolve(accounts.map(async (account) => await new Account(account).save()))
    await Promise.resolve(checks.map(async (check) => await new Check(check).save()))
    await Promise.resolve(progresses.map(async (progress) => await new Progress(progress).save()))
    await Promise.resolve(reports.map(async (report) => await new Report(report).save()))
}

module.exports = {
    accounts,
    checks,
    progresses,
    reports
}

