import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");
import { objectKeys } from "../utils/index.js";

const DIGITS_TO_NUMS = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const getDigitPrefix = (string: string): number | null => {
  const valid_digits = objectKeys(DIGITS_TO_NUMS);
  for (let i = 0; i < valid_digits.length; i++) {
    const digit = valid_digits[i];
    if (string.startsWith(digit)) {
      return DIGITS_TO_NUMS[digit];
    }
  }
  return null;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let sum = 0;

  lines.forEach((line) => {
    let firstNum;
    let secondNum;
    const chars = line.split("");

    for (let i = 0; i < chars.length; i++) {
      let maybeNum;
      maybeNum = Number(chars[i]);
      if (Number.isInteger(maybeNum)) {
        firstNum = maybeNum * 10;
        break;
      }

      const substring = line.slice(i, chars.length);
      maybeNum = getDigitPrefix(substring);
      if (maybeNum) {
        firstNum = maybeNum * 10;
        break;
      }
    }

    for (let i = chars.length - 1; i >= 0; i--) {
      let maybeNum;
      maybeNum = Number(chars[i]);
      if (Number.isInteger(maybeNum)) {
        secondNum = maybeNum;
        break;
      }

      const substring = line.slice(i, chars.length);
      maybeNum = getDigitPrefix(substring);
      if (maybeNum) {
        secondNum = maybeNum;
        break;
      }
    }

    if (firstNum === undefined || secondNum === undefined) {
      throw Error("firstNum or secondNum is null");
    }

    sum += firstNum;
    sum += secondNum;
  });

  return sum;
};

const input1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const input2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

run({
  part1: {
    tests: [
      {
        input: input1,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input2,
        expected: 281,
      },
    ],
    solution: part1,
  },
  trimTestInputs: true,
  onlyTests: false,
});
