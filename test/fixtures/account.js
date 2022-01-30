const database = require('./database')
const Account = require("../../components/account/account.model");

const createAccount = async (idx = 1) => {
    const user = await Account.findOne({_id : database.accounts[idx]._id })
    if(user) return database.accounts[idx]
    var account =  new Account(database.accounts[idx])
    account.save()
    return database.accounts[idx];
}

const findAccount = async (id) => {
    return await Account.findOne({_id: id})
}

const findByEmail = async (email) => {
    return await Account.findOne({email })
}

const clearAccounts = async (idx) => {
    await Account.remove({_id: database.accounts[idx]._id})
}

module.exports = {
    createAccount,
    clearAccounts,
    findAccount,
    findByEmail
}