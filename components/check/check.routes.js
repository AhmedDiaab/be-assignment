// imports
const CheckController = require("./check.controller");
const router = require("express").Router();
const passport = require("passport");

// create checkk
router.post("/check", passport.authenticate("jwt"), CheckController.Create);

// get check by id 
router.get("/check/:id", passport.authenticate("jwt"), CheckController.GetOne);

// get all checkks
router.get("/check", passport.authenticate("jwt"), CheckController.GetAll);

// update check
router.put("/check/:id", passport.authenticate("jwt"), CheckController.Update);

// delete check
router.delete(
  "/check/:id",
  passport.authenticate("jwt"),
  CheckController.Delete
);

// route for running the check
router.post(
  "/check/:id/run",
  passport.authenticate("jwt"),
  CheckController.RunCheck
);

module.exports = router;
