const handleCompleted = (job) => {
  console.log(`completed job ${job.id}`);
  job.remove();
};

const handleFailure = (job, err) => {
  if (job.attemptsMade >= job.opts.attempts) {
    // console.info(
    //   `Job failures above threshold in ${job.queue.name} for: ${job.id}`,
    //   err
    // );
    console.info(
        `Job failures above threshold in ${job.queue.name} for: ${job.id}`
      );
    return null;
  }
  console.info(
    `Job in ${job.queue.name} failed for: ${job.id} with ${err.message}. ${
      job.opts.attempts - job.attemptsMade
    } attempts left`
  );
};

const handleStalled = (job) => {
  console.info(`Job in ${job.queue.name} stalled for: ${job.id}`);
};

module.exports = {
  handleCompleted,
  handleFailure,
  handleStalled,
};
