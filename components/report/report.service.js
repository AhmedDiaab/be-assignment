const Report = require("./report.model");

const create = async (accountId, checkId, reportData) => {
    var exists = await Report.exists({check: checkId})
    if(exists) return await Report.findOneAndUpdate({check: checkId}, {...reportData}).lean()
    const report = new Report({account: accountId, check: checkId, ...reportData})
    return await report.save()
};

const getById = async (id) => {
    return await Report.findOne({_id: id})
};

const getByFilter = async (filter = {account, check}) => {
    var exists = await Report.exists(filter)
    if(!exists) return null
    return await Report.findOne(filter).lean()
}

const getAll = async (tags = []) => {
    const reports = !tags || tags.length == 0 ? await Report.find({ }) : 
    await Report.aggregate([
        {
          $match: {
            tags: { $in: tags },
          },
        }
      ]);
    return reports
};

const update = async (id, reportData) => {
    const exists = Report.exists({id})
    if(exists) {
        return await Report.findOneAndUpdate({_id: id}, {...reportData}, {new: true}) 
    }
    return false
};

const remove = async (id) => {
    const exists = Report.exists({id})
    if(exists) {
        return await Report.deleteOne({_id: id})
    }
    return false
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getByFilter
};
