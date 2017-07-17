const nullParser = input => {
  return input.startsWith("null") ? [null, input.slice(4)] : null;
};
const booleanParser = input => {
  return input.startsWith("true")
    ? [true, input.slice(4)]
    : input.startsWith("false") ? [false, input.slice(5)] : null;
};

const numberParser = input => {
  let numberPattern = /^[+-]?\d*\.?(\d+[eE]?[+-]?)?\d+$/;
  let res = input.match(numberPattern);
  return res ? [parseFloat(res[0]), input.slice(res[0].length)] : null;
};
