import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const map: { [key: string]: number } = {
  ".": 0,
  "#": 1,
};

const isValidIndex = (arr: number[], index: number) => {
  return index >= 0 && index < arr.length;
};

const getBaseLog = (x: number, y: number) => {
  return Math.log(y) / Math.log(x);
};

const isPowerOfTwo = (num: number) => {
  return Number.isInteger(getBaseLog(2, num));
};

const getLongestPalindrome = (arr: number[], getChangedValue: boolean) => {
  let result: number[] = [];

  let finalChangedValue = false;
  for (let i = 0; i < arr.length; i++) {
    let offset = 0;
    let changedValue = false;
    while (
      isValidIndex(arr, i - offset) &&
      isValidIndex(arr, i + 1 + offset) &&
      (arr[i - offset] == arr[i + 1 + offset] ||
        (getChangedValue === true &&
          changedValue === false &&
          isPowerOfTwo(Math.abs(arr[i - offset] - arr[i + 1 + offset]))))
    ) {
      if (arr[i - offset] != arr[i + 1 + offset]) {
        changedValue = true;
      }
      offset++;
    }
    offset -= 1;
    if (offset < 0) {
      continue;
    }
    const start = i - offset;
    const end = i + 1 + offset;

    if (
      getChangedValue === true &&
      changedValue === true &&
      (start === 0 || end === arr.length - 1)
    ) {
      result = [i - offset, i + 1 + offset];
      finalChangedValue = changedValue;
    } else if (getChangedValue === false) {
      if (start === 0 || end === arr.length - 1) {
        result = [i - offset, i + 1 + offset];
      }
    }
  }
  return {
    result,
    length: result[1] - result[0] + 1,
    changedValue: finalChangedValue,
  };
};

const process = (input: string[], getChangedValue: boolean = false) => {
  const rowNums = [];
  for (let i = 0; i < input.length; i++) {
    let total = 0;
    for (let j = 0; j < input[0].length; j++) {
      const val = map[input[i][j]];
      total += Math.pow(2, j) * val;
    }
    rowNums.push(total);
  }

  const colNums = [];
  for (let j = 0; j < input[0].length; j++) {
    let total = 0;
    for (let i = 0; i < input.length; i++) {
      const val = map[input[i][j]];
      total += Math.pow(2, i) * val;
    }
    colNums.push(total);
  }

  const rowsResult = getLongestPalindrome(rowNums, getChangedValue);
  const colsResult = getLongestPalindrome(colNums, getChangedValue);
  if (
    rowsResult.length > 0 &&
    (getChangedValue === false || rowsResult.changedValue === true)
  ) {
    const { result } = rowsResult;
    return (Math.floor((result[1] + result[0]) / 2) + 1) * 100;
  }
  if (
    colsResult.length > 0 &&
    (getChangedValue === false || colsResult.changedValue === true)
  ) {
    const { result } = colsResult;
    return Math.floor((result[1] + result[0]) / 2) + 1;
  }
  throw Error("Unreachable");
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;
  let current: string[] = [];
  lines.forEach((line, i) => {
    if (line === "") {
      sum += process(current);
      current = [];
    } else {
      current.push(line);
    }
  });
  sum += process(current);

  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;
  let current: string[] = [];
  lines.forEach((line, i) => {
    if (line === "") {
      sum += process(current, true);
      current = [];
    } else {
      current.push(line);
    }
  });
  sum += process(current, true);

  return sum;
};

const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

const input2 = `
#...##.
####..#
....##.
..#.##.
#.##..#
.##....
...#..#
..###.#
#..####
#...##.
#...##.`;

const input3 = `#..#....#
#..#....#
#....##..
.###..#.#
.#.##...#
..#....##
..#....##
.#.##...#
.###..#..`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 405,
      },
      {
        input: input2,
        expected: 1000,
      },
      {
        input: input3,
        expected: 100,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
