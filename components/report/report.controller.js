const ReportService = require("./report.service");
const catchAsync = require("../../utils/catchAsync");

module.exports = {
  GetAll: catchAsync(async (req, res, next) => {
    const reports = await ReportService.getAll(req.query.tags);
    res.json({
      status: "success",
      data: reports,
    });
  }),
  GetById: catchAsync(async (req, res, next) => {
    const report = await ReportService.getById(req.params.id);
    res.json({
      status: "success",
      data: report,
    });
  }),
  Delete: catchAsync(async (req, res, next) => {
    const report = await ReportService.remove(req.params.id);
    if (report)
      return res.json({
        status: "success",
      });
    res.json({
      status: "fail",
    });
  }),
};
