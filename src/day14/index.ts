import run from "aocrunner";
import { rotate } from "2d-array-rotation";

const parseInput = (rawInput: string) => rawInput.split("\n");

const ROCK = "O";
const SQUARE_ROCK = "#";
const ROCKS: string[] = [ROCK, SQUARE_ROCK];

const moveRocksUp = (lines: string[][]) => {
  // move O up until # or . or O above or reach top, swap elements
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === ROCK) {
        let currIdx = i;
        let prevIdx = i - 1;
        while (
          prevIdx >= 0 &&
          lines[currIdx][j] === ROCK &&
          !ROCKS.includes(lines[prevIdx][j])
        ) {
          // swap
          lines[currIdx][j] = lines[prevIdx][j];
          lines[prevIdx][j] = ROCK;
          prevIdx--;
          currIdx--;
        }
      }
    }
  }
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput).map((line) => line.split(""));
  moveRocksUp(lines);

  return lines.reduce((acc, line, i) => {
    return acc + line.filter((el) => el === ROCK).length * (lines.length - i);
  }, 0);
};

const part2 = (rawInput: string) => {
  let lines = parseInput(rawInput).map((line) => line.split(""));

  const seen = new Map();
  const sums = new Map();

  for (let i = 0; i < 1000000000; i++) {
    // north
    moveRocksUp(lines);
    // west
    lines = rotate(lines, 90);
    moveRocksUp(lines);
    // south
    lines = rotate(lines, 90);
    moveRocksUp(lines);
    // east
    lines = rotate(lines, 90);
    moveRocksUp(lines);

    lines = rotate(lines, 90);

    const string = lines.map((line) => line.join("")).join("");
    if (seen.has(string)) {
      const cycleStart = seen.get(string);
      const cycleDiff: number = i - cycleStart;
      const mod = (999999999 - cycleStart) % cycleDiff;
      return sums.get(cycleStart + mod);
    }
    const sum = lines.reduce((acc, line, i) => {
      return acc + line.filter((el) => el === ROCK).length * (lines.length - i);
    }, 0);
    seen.set(string, i);
    sums.set(i, sum);
  }

  throw Error("Unreachable");
};

const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
