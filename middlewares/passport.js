// imports
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const AccountService = require("../components/account/account.service");
const { randomBytes } = require("crypto");
const { verify } = require("jsonwebtoken");

// serialize user
passport.serializeUser(function (user, done) {
  done(null, user);
});

// deserialize user
passport.deserializeUser(function (user, done) {
  done(null, user);
});

// register strategy options
const registerStrategyOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

// creating named strategy and its implementation here
passport.use(
  "Register",
  new LocalStrategy(
    registerStrategyOptions,
    async (req, email, password, done) => {
      try {
        // handle creating email if not exists
        email = String(email).toLowerCase();
        const token = randomBytes(32).toString("base64");
        // create account service used here
        var account = await AccountService.create({
          email,
          password,
          verificationToken: token,
        });
        delete account._doc.password;
        const user = {
          ...account._doc,
        };
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// login strategy options
const loginStrategyoptions = {
  usernameField: "email",
  passwordField: "password",
};

// create named strategy for login
passport.use(
  "Login",
  new LocalStrategy(loginStrategyoptions, async (email, password, done) => {
    try {
      email = String(email).toLowerCase();
      // handle fetching email for login
      const account = await AccountService.findByEmail(email);
      const isValidPassword = account.isValidPassword(
        password,
        account.password
      );
      if (!account && !isValidPassword)
        return done(null, false, { message: "Invalid email or password." });
      done(null, account);
    } catch (error) {
      done(error);
    }
  })
);

// create named strategy for jwt
passport.use(
  new JWTstrategy(
    {
      // keys here is being replaced with secret key that is imported from some other place or file
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async function (req, user, done) {
      try {
        // getting user by email and save it in the request
        let account = user;
        delete account.password;
        delete account.hash;
        delete account.salt;

        req.user = account;
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
