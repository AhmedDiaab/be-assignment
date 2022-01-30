const database = require('./database')
const Report = require("../../components/report/report.model");

const createReport = async(idx) => {
    const report = await Report.findOne({_id: database.reports[idx]._id})
    if(report) return database.reports[idx]
    const _report = new Report(database.reports[idx])
    await _report.save()
    return database.reports[idx]
}



module.exports = {createReport}