const catchAsync = require("../../utils/catchAsync");
const CheckService = require("./check.service");
const CheckProducer = require("../../services/Queue/check/producer");
const ProgressService = require("../../components/progress/progress.service")

module.exports = {
  Create: catchAsync(async (req, res, next) => {
    const check = await CheckService.create({
      ...req.body,
      account: req.user._id,
    });
    return res.json({
      status: "success",
      data: {
        check,
      },
    });
  }),
  GetOne: catchAsync(async (req, res, next) => {
    const checks = await CheckService.getById(req.params.id);
    return res.json({
      status: "success",
      data: checks,
    });
  }),
  GetAll: catchAsync(async (req, res, next) => {
    const checks = await CheckService.getAll(req.query.tags);
    return res.json({
      status: "success",
      data: checks,
    });
  }),
  Update: catchAsync(async (req, res, next) => {
    const check = await CheckService.update({
      _id: req.params.id,
      ...req.body,
    });
    if (!check)
      return res.json({
        status: "fail",
        message: "Check not found",
      });
    res.json({
      status: "success",
      data: {
        check,
      },
    });
  }),
  Delete: catchAsync(async (req, res, next) => {
    const check = await CheckService.remove(req.params.id);
    if (!check)
      return res.json({
        status: "fail",
        message: "Check does not exist.",
      });
    res.json({
      status: "success",
    });
  }),
  RunCheck: catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const check = await CheckService.getById(id);
    const progress = await ProgressService.findByCheck(check._id);
    if (progress.status != "Stopped" && progress.progress == 100)
      return res.json({
        status: "success",
        data: {
          message: "check is already running...",
        },
      });
    CheckProducer.runCheck(check);
    res.json({
      status: "success",
      data: {
        message: "check is running now...",
      },
    });
  }),
};
