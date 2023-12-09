import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const calculcateDiffs = (line: string) => {
  const values = line.split(" ").map(Number);
  const diffs: number[][] = [];
  diffs.push(values);

  while (diffs[diffs.length - 1].every((val) => val === 0) === false) {
    const currentDiffs = diffs[diffs.length - 1];
    const nextDiffs = [];
    for (let i = 0; i < currentDiffs.length - 1; i++) {
      const diff = currentDiffs[i + 1] - currentDiffs[i];
      nextDiffs.push(diff);
    }
    diffs.push(nextDiffs);
  }
  return diffs;
};

const calculatePreviousValue = (line: string) => {
  const diffs = calculcateDiffs(line);

  diffs[diffs.length - 1].unshift(0);
  for (let i = diffs.length - 2; i >= 0; i--) {
    const previousValueForDiff = diffs[i][0] - diffs[i + 1][0];
    diffs[i].unshift(previousValueForDiff);
  }
  return diffs[0][0];
};

const calculateNextValue = (line: string) => {
  const diffs = calculcateDiffs(line);

  diffs[diffs.length - 1].push(0);
  for (let i = diffs.length - 2; i >= 0; i--) {
    const nextValueForDiff =
      diffs[i][diffs[i].length - 1] + diffs[i + 1][diffs[i + 1].length - 1];
    diffs[i].push(nextValueForDiff);
  }
  return diffs[0][diffs[0].length - 1];
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;
  lines.forEach((line) => {
    const nextValue = calculateNextValue(line);
    sum += nextValue;
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;
  lines.forEach((line) => {
    const nextValue = calculatePreviousValue(line);
    sum += nextValue;
  });

  return sum;
};

const input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
