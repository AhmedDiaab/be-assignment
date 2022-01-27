// imports
const {connectQueue} = require('../QueueService')
const sparkles = require('sparkles')()


// define job options
const jobOptions = {
    removeOnComplete: true, // auto remove on job completed
    delay: 1000, // time in ms, delay till job served
    attempts: 3 // attempt if job failed or returned error
}
// name of queue
const name = process.env.MAIL_QUEUE_NAME

// function will be used by sparkles to add email to be processed later
const addMailToQueue = async (data = {email, content, subject}) => {
    return await connectQueue(name).add(data,jobOptions)
}

// sparkles define on send-email event
sparkles.on('send-email', (data = {email, content, subject}) => {
    console.log('working on processing')
    addMailToQueue(data)
    .then(res => {
        console.log(`Mail added to queue, will be processed within 1 minute...`)
    })
})

const sendEmail = (data = {email, content, subject})  =>{
    sparkles.emit('send-email', data)
}

module.exports = {sendEmail}