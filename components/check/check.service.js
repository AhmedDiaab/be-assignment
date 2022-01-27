const Check = require("./check.model");
const ProgressService = require('../progress/progress.service')
// function to create Check
const create = async (checkData) => {
  // every check created, another progress attached to it

  const check = new Check(checkData);
  const progress = await ProgressService.create(check._id,{progress: 0, status: "Stopped"})
  check.progress = progress._id;
  const savedCheck = await check.save();
  return savedCheck
};

// function used to get check by id
const getById = async (checkId) => {
  return await Check.findOne({ _id: checkId }).populate('progress');
};
// function used to get all checks
const getAll = async (tag = null) => {
  const checks = !tag
    ? await Check.find({}).populate('progress')
    : await Check.find({ tags: [tag] }).populate('progress');
  return checks;
};

// function to update Check using id
const update = async (checkData = { _id, ...opts }) => {
  const exists = await Check.exists({ _id: checkData._id });
  if (exists) {
    return await Check.updateOne(
      { _id: checkData._id },
      { ...checkData.opts },
      { new: true }
    ).populate('progress');
  }
  return null;
};

// funcyion used to delete check using id
const remove = async (checkId) => {
  const exists = await Check.exists({ _id: checkId });
  if (exists) {
    await Check.deleteOne({ _id: checkId });
    return true;
  }
  return false;
};

module.exports = {
  create,
  getById,
  getAll,
  update,
  remove,
};
