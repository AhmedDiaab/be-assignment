const router = require("express").Router();
const ReportController = require("./report.controller");
const passport = require("passport");

router.get(
  "/report/all",
  passport.authenticate("jwt"),
  ReportController.GetAll
);

router.get(
  "/report/:id",
  passport.authenticate("jwt"),
  ReportController.GetById
);

router.delete(
  "/report/:id",
  passport.authenticate("jwt"),
  ReportController.Delete
);

module.exports = router;
