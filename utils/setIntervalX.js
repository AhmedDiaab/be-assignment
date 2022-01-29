// imports
const { setInterval } = require("timers/promises");

// helper function that used to send request, using setTimeout and setInterval

module.exports = async (cb, interval, timeout) => {
  var isFirst = true;
  for await (let startTime of setInterval(interval, Date.now())) {
    const now = Date.now();
    const current = now - startTime;
    const end = timeout + interval;
    if (typeof cb == "function") cb(current, end, isFirst);
    if (current > end) break;
    isFirst = false;
  }
};
