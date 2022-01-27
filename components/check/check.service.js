const Check = require("./check.model");
const ProgressService = require("../progress/progress.service");
// function to create Check
const create = async (checkData) => {
  // check if already exists or with same name then will be returned
  var exists = await Check.exists({ name: checkData.name });
  if (exists) {
    var _check = await Check.findOne({ name: checkData.name }).lean();
    if (_check.account == checkData.account) return _check;
    return null;
  }
  // every check created, another progress attached to it
  const check = new Check(checkData);
  const progress = await ProgressService.create(check._id, {
    progress: 0,
    status: "Stopped",
  });
  check.progress = progress._id;
  const savedCheck = await check.save();
  return savedCheck;
};

// function used to get check by id
const getById = async (checkId) => {
  return await Check.findOne({ _id: checkId }).populate("progress").lean();
};
// function used to get all checks
const getAll = async (tags = []) => {
  const checks =
    !tags || tags.length == 0
      ? await Check.find({}).populate("progress")
      : await Check.aggregate([
          {
            $match: {
              tags: { $in: tags },
            },
          },
          {
            $lookup: {
              from: "progresses",
              localField: "progress",
              foreignField: "_id",
              as: "progress",
            },
          },
          {
            $unwind: "$progress",
          },
        ]);
  return checks;
};

// function to update Check using id
const update = async (checkData = { _id, ...opts }) => {
  delete checkData.name;
  const exists = await Check.exists({ _id: checkData._id });
  if (exists) {
    return await Check.findOneAndUpdate(
      { _id: checkData._id },
      { ...checkData },
      { new: true }
    ).populate("progress");
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
