const fs = require('fs')
const path = require('path')
const example = fs
  .readFileSync(path.join(__dirname, './example.json'))
  .toString()
// console.log(example);

const spaceParser = input => {
  input = input.replace(/^\s+/, '')
  return input
}

const nullParser = input => {
  input = spaceParser(input)
  return input.startsWith('null') ? [null, input.slice(4)] : null
}

const booleanParser = input => {
  input = spaceParser(input)
  return input.startsWith('true')
    ? [true, input.slice(4)]
    : input.startsWith('false') ? [false, input.slice(5)] : null
}

const numberParser = input => {
  input = spaceParser(input)
  let numberPattern = /^[+-]?\d*\.?(\d+[eE]?[+-]?)?\d+/
  let res = input.match(numberPattern)
  return res ? [parseFloat(res[0]), input.slice(res[0].length)] : null
}

const stringParser = input => {
  // console.log(input);
  input = spaceParser(input)
  // console.log(input);
  if (input.startsWith('"')) {
    let slicedInput = input.slice(1)
    let len = 0
    for (let i = 0; i < slicedInput.length; i++) {
      if (slicedInput[i] === '\\' && slicedInput[i + 1] === '"') {
        slicedInput = slicedInput.replace(/\\"/, '"')
        len++
        i++
      } else if (slicedInput[i] === '"' && slicedInput[i - 1] !== '\\') {
        len++
        return [slicedInput.slice(0, len - 1), spaceParser(slicedInput.slice(len))]
      }
      len++
    }
    return null
  }
  return null
}

const commaParser = input => {
  input = spaceParser(input)
  return input.startsWith(',') ? [',', input.slice(1)] : null
}

const colonParser = input => {
  input = spaceParser(input)
  return input.startsWith(':') ? [':', input.slice(1)] : null
}

const arrayParser = input => {
  // console.log(input);
  input = spaceParser(input)
  if (!input.startsWith('[')) return null
  let outputArr = []
  let firstSliced = input.slice(1)
  firstSliced = spaceParser(firstSliced)
  let check = commaParser(firstSliced)
  if (check) return null
  if (firstSliced[0] === ']') return arrayHelper(firstSliced, outputArr)
  return arrayHelper(firstSliced, outputArr)
}

const arrayHelper = (input, outputArr) => {
  let res
  if (input[0] === ']') return [outputArr, spaceParser(input.slice(1))]
  if (input[0] === ',') res = factoryParser(spaceParser(input.slice(1)))
  else res = factoryParser(input)
  if (res[1][0] !== ']' && res[1][0] !== ',') return null
  outputArr.push(res[0])
  return arrayHelper(res[1], outputArr)
}

const checkForComma = input => {
  let comma = commaParser(input)
  return comma || null
}

const factoryParser = input => {
  let res
  if (res = nullParser(input)) return res
  if (res = booleanParser(input)) return res
  if (res = numberParser(input)) return res
  if (res = stringParser(input)) return res
  if (res = arrayParser(input)) return res
  return null
}

const output = input => {
  let res = factoryParser(input)
  return res || 'invalid json'
}

// console.log(spaceParser(example));
// console.log(arrayParser(example))
// console.log(stringParser(example))
// console.log(output(example));
