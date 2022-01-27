const CheckController = require("./check.controller");
const router = require("express").Router();
const passport = require("passport");

router.post("/check", passport.authenticate("jwt"), CheckController.Create);

router.get("/check/:id", passport.authenticate("jwt"), CheckController.GetOne);

router.get("/check/all", passport.authenticate("jwt"), CheckController.GetAll);

router.put("/check/:id", passport.authenticate("jwt"), CheckController.Update);

router.delete(
  "/check/:id",
  passport.authenticate("jwt"),
  CheckController.Delete
);

module.exports = router;
