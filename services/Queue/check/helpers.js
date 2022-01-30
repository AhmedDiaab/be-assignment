// imports 
const ProgressService = require('../../../components/progress/progress.service')
const ReportService = require("../../../components/report/report.service")
const AccountService = require('../../../components/account/account.service')
const { average } = require('../../../utils/operations');
const MailProducer = require("../mail/producer");

// function used when sending email, whether website is down or up

const sendMail = async (account, reportId, content) => {

    // getting email of the user
    const { email } = await AccountService.findById(account)
    // generating link for report
    const link = `${process.env.BASE_URL}/report/${reportId}`

    // wrapping data into object
    const mailData = {
        email,
        subject: "Regarding your check <CheckAPI>",
        content
    }

    // sending email to user
    MailProducer.sendEmail(mailData)
}

// getting duration for error
const getDuration = (start) => {
  const end = process.hrtime(start)
  const milliseconds = Math.round((end[0] * 1000) + (end[1] / 1000000))
  return milliseconds
}

// functions used in jobs for reject and resolve the check
const onReject = async (error,check ,current, end, isFirst, done) => {

    // calculate duration
    const duration = getDuration(error.config.headers['request-startTime'])

    // calculating percentage 
    const checkProgress = parseInt((current / end * 100))

    // get progress
    var progress = await ProgressService.findByCheck(check._id)

    // handle recheck after completing the check
    progress.responseTime =  isFirst ? [duration] : [...progress.responseTime, duration]

    // create history document that contain log
    const log = `${new Date(Date.now())} ${error.request.method.toUpperCase()} ${error.response.status} ${error.config.url} ${String(check.protocol).toUpperCase()} ${duration} ms`

    // append logs to progress
    const logs = isFirst ? [log] : [...progress.history, log]

    // handle case null 
    if(!progress.failures) progress.failures = 0

    // handle failures
    progress.failures = progress.failures + 1

    // update progress
    await ProgressService.update(check._id, checkProgress, "Stopped", progress.responseTime, logs, progress.failures++)

    // handling report

    // setting report to down status
    const report = await ReportService.getByFilter({account: check.account, check: check._id})


    // calculating downtime 
    const downtime = report.downtime + (check.interval / 60);

    // calculating availability 
    const availability = (report.uptime / (downtime + report.uptime)) * 100
    

    // updating report
    await ReportService.update(report._id, {
        status: "Down",
        downtime: downtime,
        availability: availability,
        outages: report.outages + 1
    })

    // sending email when check is down
    // getting email of the user
    const { email } = await AccountService.findById(check.account)
    
    // generating link for report
    const link = `${process.env.BASE_URL}/report/${report._id}`

    // creating content of email
    const content = `
        <p>Website is down now, you can check report details on : </p><br />
        <a href="${link}">${link}</a>
    `
    // wrapping data into object
    const mailData = {
        email,
        subject: "Regarding your check <CheckAPI>",
        content
    }

    // checking for threshold 
    if(progress.failures != check.threshold) return done(error)

    // sending email to user
    MailProducer.sendEmail(mailData)

    done(error)
}

/**
 * function used in consumer.js of check 
 * @param {import("axios").AxiosResponse} response 
 */
const onResolve = async (response, check ,current, end, isFirst ,done) => {
    
    // calculating percentage 
    const checkProgress = parseInt((current / end * 100))

    const checkStatus = checkProgress < 100 ? "Running" : "Stopped"
    // get progress
    var progress = await ProgressService.findByCheck(check._id)
    // update check progress
    // handle null case
    progress.responseTime = progress.responseTime ? progress.responseTime : []
    
    // handle recheck after completing the check
    progress.responseTime =  isFirst ? [response.headers['request-duration']] : [...progress.responseTime, response.headers['request-duration']]
    
    // create history document that contain log
    const log = `${new Date(Date.now())} ${response.config.method.toUpperCase()} ${response.config.url} ${String(check.protocol).toUpperCase()} ${parseInt(response.headers['request-duration'])} ms`

    // handle null case of progress.history 
    progress.headers = progress.history ? progress.history : []

    // append logs to progress
    const logs = isFirst ? [log] : [...progress.history, log]

    // update progress
    progress = await ProgressService.update(check._id, checkProgress, checkStatus, progress.responseTime, logs)

    // getting report 
    const report = await ReportService.getByFilter({account: check.account, check: check._id})

    // generating link for report
    const link = `${process.env.BASE_URL}/report/${report._id}`

    // creating content for email
    var content = `
        <p>Website is up now, you can check report details on : </p><br />
        <a href="${link}">${link}</a>
    `

    // notify user by email when website is up
    if(report.status == "Down")  {
        await ReportService.create(check.account,check._id, {status: "Up"})

        // sending email to user
        await sendMail(check.account,report._id, content)
        
    }

    // if progress < 100 then report will not  generated
    if(checkProgress < 100) return done(null, true)    

    // calculating uptime of the server
    const uptime = (report.uptime ? report.uptime : 0 ) + (end / 60)

    // update report
    const reportData = {
        status: "Up",
        availability: (uptime / ((report ? report.downtime : 0) + uptime)) * 100,
        outages: report.outages ? report.outages : 0,
        uptime: uptime,
        responseTime: average(progress.responseTime).toFixed(2),
        downtime: report.downtime ? report.downtime : 0,
        history: progress.history
    } 
    // if there is no report
    if (!report) await ReportService.create(check.account,check._id, reportData)

    // if there is a report
    ReportService.update(report._id, reportData)

    content = `
        <p>Your report is up now, you can check report details on : </p><br />
        <a href="${link}">${link}</a>
    `

    // sending email to user
    await sendMail(check.account,report._id, content)
    
    // make job done
    done(null, true)
}

module.exports = {
    onReject, onResolve
}