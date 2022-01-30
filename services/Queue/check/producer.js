// imports
const {connectQueue} = require('../QueueService')
const sparkles = require('sparkles')()


// define job options
const jobOptions = {
    removeOnComplete: true, // auto remove on job completed
    delay: 0, // time in ms, delay till job served
    attempts: 3, // attempt if job failed or returned error
}
// name of queue
const name = process.env.Check_QUEUE_NAME

// function will be used by sparkles to add checks to be processed later
const addCheckToQueue = async (data) => {
    return await connectQueue(name).add(data, jobOptions)
}

// sparkles define on send-email event
sparkles.on('run-check', (data) => {
    console.log('working on processing')
    addCheckToQueue(data)
    .then(res => {
        console.log(`Check added to queue, and is being processed...`)
    })
})

const runCheck = (data)  =>{
    sparkles.emit('run-check', data)
}

module.exports = {runCheck}