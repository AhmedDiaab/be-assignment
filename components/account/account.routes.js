//imports
const router = require("express").Router();
const AccountController = require("./account.controller");
const passport = require("passport");

// declaring routes
router.get(
  "/account",
  passport.authenticate("jwt"),
  AccountController.GetAccountData
);

router.post("/account/pass", 
passport.authenticate("jwt"),
AccountController.UpdatePassword
)

module.exports = router;
