// helper function to get average of an array
const average = (array) => {
  return array.reduce((a, b) => a + b) / array.length;
};

module.exports = { average };
