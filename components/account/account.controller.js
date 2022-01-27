// imports
const AccountService = require("./account.service");
const catchAsync = require("../../utils/catchAsync");
const MailService = require('../../services/MailService')

module.exports = {
    // function used to get account data
  GetAccountData: catchAsync(async (req, res, next) => {
      // account fetched from db with account service
      const account = AccountService.getData(req.user._id)
      return res.json({
          status: "success",
          data: {...account}
      })
  }),
  UpdatePassword: catchAsync(async (req, res, next) => {
      // get old password and new password from request body
    const { currentPassword, newPassword } = req.body;
    // use account service to update password
    const result = await AccountService.updatePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    return res.json(result);
  }),
};
