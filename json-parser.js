const fs = require("fs");
const path = require("path");
const example = fs
  .readFileSync(path.join(__dirname, "./example.json"))
  .toString();
//console.log(example);

const spaceParser = input => {
  input = input.replace(/\s+/, "");
  return input;
};

const nullParser = input => {
  input = spaceParser(input);
  return input.startsWith("null") ? [null, input.slice(4)] : null;
};
const booleanParser = input => {
  input = spaceParser(input);
  return input.startsWith("true")
    ? [true, input.slice(4)]
    : input.startsWith("false") ? [false, input.slice(5)] : null;
};

const numberParser = input => {
  input = spaceParser(input);
  let numberPattern = /^[+-]?\d*\.?(\d+[eE]?[+-]?)?\d+/;
  let res = input.match(numberPattern);
  return res ? [parseFloat(res[0]), input.slice(res[0].length)] : null;
};

const stringParser = input => {
  input = spaceParser(input);
  if (input.startsWith('"')) {
    let slicedInput = input.slice(1);
    let len = 0;
    for (let i = 0; slicedInput.length; i++) {
      //console.log(slicedInput[i]);
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

const commaParser = input => {
  input = spaceParser(input);
  return input.startsWith(",") ? [",", input.slice(1)] : null;
};

const colonParser = input => {
  input = spaceParser(input);
  return input.startsWith(":") ? [":", input.slice(1)] : null;
};

const factoryParser = input => {
  if ((res = nullParser(input))) return res;
  if ((res = booleanParser(input))) return res;
  if ((res = numberParser(input))) return res;
  if ((res = stringParser(input))) return res;
  return null;
};

const output = input => {
  let res = factoryParser(input);
  return res ? res : "invalid json";
};

//console.log(spaceParser(example));
//console.log(arrayParser(example));
console.log(output(example));
