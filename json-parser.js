const fs = require("fs");
const path = require("path");
const example = fs
  .readFileSync(path.join(__dirname, "./example.json"))
  .toString();
//console.log(example);

const nullParser = input => {
  return input.startsWith("null") ? [null, input.slice(4)] : null;
};
const booleanParser = input => {
  return input.startsWith("true")
    ? [true, input.slice(4)]
    : input.startsWith("false") ? [false, input.slice(5)] : null;
};

const numberParser = input => {
  let numberPattern = /^[+-]?\d*\.?(\d+[eE]?[+-]?)?\d+/;
  let res = input.match(numberPattern);
  return res ? [parseFloat(res[0]), input.slice(res[0].length)] : null;
};

const stringParser = input => {
  if (input.startsWith('"')) {
    let slicedInput = input.slice(1);
    let len = 0;
    for (let i = 0; slicedInput.length; i++) {
      console.log(slicedInput[i]);
      if (slicedInput[i] === '"') {
        if (slicedInput[i - 1] === "\\") {
          len++;
        } else {
          len++;
          break;
        }
      } else {
        len++;
      }
    }
    return [input.slice(0, len + 1), input.slice(len + 1)];
  }
  return null;
};

const spaceParser = input => {
  input = input.replace(/\s+/, "");
  return input;
};
console.log(spaceParser(example));
