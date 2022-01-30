const passport = require("passport");
const JWTService = require("../../services/JWTService");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");
const MailProducer = require("../../services/Queue/mail/producer");
const AccountService = require("../account/account.service");
const { sign } = require("jsonwebtoken");

module.exports = {
  Login: async (req, res, next) => {
    passport.authenticate("Login", async (err, user, info) => {
      if (err || !user) {
        console.log(err);
        //AUTH FAILED, USER NAME OR PASSWORD INCORRECT
        const error = new AppError(info.message, "400", info.message);
        return next(error);
      }
      // login function from passport
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // handling jwt generation
        const result = JWTService.generateToken(user);

        return res.json({
          status: "success",
          data: {
            ...result,
          },
        });
      });
    })(req, res, next);
  },
  Register: catchAsync(async (req, res, next) => {
    passport.authenticate("Register", async (err, user, info) => {
      try {
        // check for errors or no user case
        if (err || !user) {
          const errorMessages = [];
          // loop through errors
          for (let e in err.errors) {
            errorMessages.push(err.errors[e].properties.message);
          }
          // map error to AppError
          const error = new AppError(
            errorMessages.join(","),
            "400",
            errorMessages.join(",")
          );
          return next(error);
        }

        const token = sign({
          token: user.verificationToken,
          account: user._id
        },process.env.MAIL_TOKEN_SECRET, {
          expiresIn: "15m",
        });
        // call mail service
        const content = `
          Please confirm your account throught this link <br />
          <a href="http://localhost:8080/api/v1/account/verify/${token}">http://localhost:8080/api/v1/account/verify/${token}</a>
        `;
        MailProducer.sendEmail({
          email: user.email,
          content,
          subject: "CheckAPI Account Confirmation",
        });
        const result = JWTService.generateToken(user);
        return res.json({
          status: "success",
          data: {
            ...result,
          },
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  }),
  VerifyAccount: catchAsync(async (req, res, next) => {
    // encoded token in url holds user id and token in account
    const valid = await AccountService.validateToken(req.params.token);
    if (valid)
      return res.json({
        status: "success",
        message: 'Account verified.'
      });
    return res.json({
      status: "fail",
      message: 'Invalid token or expired.'
    });
  }),
};
