// imports
const { connectQueue } = require("../QueueService");
const {
  handleCompleted,
  handleFailure,
  handleStalled,
} = require("../handlers/handler");
var axios = require("../../Axios");
const { onReject, onResolve } = require("./helpers");
const setIntervalX = require("../../../utils/setIntervalX");

// queue name
const name = process.env.Check_QUEUE_NAME;

// cases in the queue
const cases = connectQueue(name);

//job process checks
const processJob = (job, done) => {
  // process check
  try {
    // getting check
    const check = job.data;
    // destructure object
    const { port, protocol, url, timeout, interval, threshold, progress } =
      check;
    // define url that will be monitored
    const URL = !port ? `${String(protocol).toLowerCase()}://${url}` : `${String(protocol).toLowerCase()}://${url}:${port}`;    
    setIntervalX(
      (current, end, isFirst) => {
        axios
          .get(URL)
          .then((response) =>
            onResolve(response, check, current, end, isFirst, done)
          )
          .catch((error) =>
            onReject(error, check, current, end, isFirst, done)
          );
      },
      timeout,
      interval + timeout
    );
  } catch (error) {
    // handle error
    console.log(error);
    done(null, error);
  }
};

// wrapper function to be readable when importing
const init = async () => {
  console.info(
    `Checking URL job is working! \nCheck in queue : ${await cases.count()}`
  );
  cases.process(processJob);
  cases.on("failed", handleFailure);
  cases.on("completed", handleCompleted);
  cases.on("stalled", handleStalled);
};

module.exports = { init };
