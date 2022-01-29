// imports
const Progress = require("./progress.model");

// create progress for check
const create = async (
  checkId,
  progressData = { progress: 0, status: "Stopped" }
) => {
  const progress = new Progress({ check: checkId, ...progressData });
  return await progress.save();
};

// update progress 
const update = async (checkId, progress, status, responseTime, history, failures) => {
  return await Progress.findOneAndUpdate(
    { check: checkId },
    { progress, status, responseTime, history, failures },
    { new: true }
  );
};

// find progress document using check id
const findByCheck = async (checkId) => {
  return await Progress.findOne({ check: checkId }).lean();
};
// remove progress of a check using check id
const remove = async (checkId) => {
  return await Progress.deleteOne({ check: checkId });
};

module.exports = {
  create,
  update,
  remove,
  findByCheck,
};
