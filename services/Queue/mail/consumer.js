// imports
const MailService = require("../../MailService");
const { connectQueue } = require("../QueueService");
const {
  handleCompleted,
  handleFailure,
  handleStalled,
} = require("../handlers/handler");

// queue name
const name = process.env.MAIL_QUEUE_NAME

// cases in the queue
const cases = connectQueue(name);

//job process mails
const processJob = (job, done) => {
  // send mail to client
  try {
    // destructure object
    const { subject, content, email } = job.data;

    // use mail service to send emails for each job
    MailService.sendMail(subject, content, email).then((res) => {
      done(null, "success");
    });
  } catch (err) {
    // handle error
    done(null, error);
  }
};

const init = async () => {
  console.info(`sending mail job is working! \nmails in queue : ${await cases.count()}`);
  cases.process(processJob);
  cases.on("failed", handleFailure);
  cases.on("completed", handleCompleted);
  cases.on("stalled", handleStalled);
};

module.exports = {init}
