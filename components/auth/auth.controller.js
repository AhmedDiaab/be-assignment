const passport = require("passport");

module.exports = {
  Login: async (req, res, next) => {
    passport.authenticate("Login", (err, user, info) => {
      passport.authenticate("login", async (err, user, info) => {
        if (err || !user) {
          //AUTH FAILED, USER NAME OR PASSWORD INCORRECT
          const error = new AppError(info.message, "400", info.message);
          return next(error);
        }
        // login function from passport
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          // handling jwt generation
          const result = JwtTokenService.generateToken(user);
          
          return res.json({
            status: "success",
            data: {
              ...result,
            },
          });
        });
      })(req, res, next);
    })(req, res, next);
  },
  Register: async (req, res, next) => {
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

        const result = JwtTokenService.generateToken(user);
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
  },
};
