const Progress = require('./progress.model')

const create = async (checkId, progressData = {progress : 0, status : 'Stopped'}) => {
    const progress = new Progress({check: checkId, ...progressData})
    return await progress.save()
}

const update = async (checkId, progress, status) => {
    return await Progress.findOneAndUpdate({check: checkId}, {progress, status}, {new: true})
}

const remove = async (checkId) => {
    return await Progress.deleteOne({check: checkId})
}

module.exports = {
    create, update, remove
}