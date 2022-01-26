const passport = require("passport");
const JWTService = require("../../services/JWTService");
const AppError = require("../../utils/AppError");
const catchAsync = require("../../utils/catchAsync");

module.exports = {
  Login: async (req, res, next) => {
    passport.authenticate("Login", async (err, user, info) => {
      if (err || !user) {
        console.log(err)
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
};
