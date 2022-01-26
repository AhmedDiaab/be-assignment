const Account = require("./account.model");
const { compare } = require("bcrypt");
// used to create account, called in register route in auth
const create = async (account = { email, password }) => {
  const accountData = new Account(account);
  return accountData.save();
};

const findById = async (accountId) => {
  return await Account.findOne({_id: accountId})
}

const findByEmail = async(email) => {
  return await Account.findOne({email})
}

// used to get account data
const getData = async (accountId) => {
  return await Account.findOne({_id: accountId}).select('email verified')
}
// used to update password
const updatePassword = async (accountId, currentPassword, newPassword) => {
  var account = await Account.findOne({ _id: accountId });
  var match = await compare(currentPassword, account.password);
  if (!match)
    return {
      response: {
        status: "Forbidden",
        data: { message: "invalid current password" },
      },
    };
  if (currentPassword == newPassword) {
    return {
      response: {
        status: "Not Acceptable",
        data: {
          message: "you already entered current password as new password",
        },
      },
    };
  }

  account.password = newPassword;
  await account.save();
  return {
    status: "success",
    data: "password updated",
  };
};

module.exports = {
  create,
  getData,
  updatePassword,
  findById,
  findByEmail
};
