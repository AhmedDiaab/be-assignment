const Account = require("./account.model");
const { compare } = require("bcrypt");
const { verify } = require("jsonwebtoken");

// used to create account, called in register route in auth
const create = async (account = { email, password, verificationToken }) => {
  const accountData = new Account(account);
  return accountData.save();
};
// find account by id
const findById = async (accountId) => {
  return await Account.findOne({ _id: accountId }).lean();
};
// find account by email
const findByEmail = async (email) => {
  return await Account.findOne({ email });
};

// used to get account data
const getData = async (accountId) => {
  return await Account.findOne({ _id: accountId })
    .select("email verified")
    .lean();
};
// used to update password
const updatePassword = async (accountId, currentPassword, newPassword) => {
  var account = await Account.findOne({ _id: accountId }).lean();
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
// token validation for email sent
const validateToken = async (urlToken) => {
  const payload = verify(urlToken, process.env.MAIL_TOKEN_SECRET);
  if (payload.token && payload.account) {
    const exists = await Account.exists({ _id: payload.account });
    if (!exists) return false;
    var _account = await Account.findOne({ _id: payload.account }).lean();
    if (_account.verificationToken == payload.token) {
      await Account.findOneAndUpdate(
        { _id: payload.account },
        { verified: true, verificationToken: null }
      );
      return true;
    }
    return false;
  }
  else return false
};

module.exports = {
  create,
  getData,
  updatePassword,
  findById,
  findByEmail,
  validateToken,
};
