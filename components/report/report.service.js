const Report = require("./report.model");

const create = async (accountId, checkId, reportData) => {
    const report = new Report({account: accountId, check: checkId, ...reportData})
    return await report.save()
};

const getById = async (id) => {
    return await Report.findOne({_id: id})
};

const getAll = async (accountId = null) => {
    const reports = !accountId ? await Report.find({ }) : await Report.find({ account: accountId })
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
};
