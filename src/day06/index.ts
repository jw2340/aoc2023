import run from "aocrunner";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const solveQuadraticEquation = require("solve-quadratic-equation");

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const times = lines[0]
    .slice("Time:".length)
    .split(" ")
    .filter((el) => el !== "")
    .map(Number);
  const distances = lines[1]
    .slice("Distance:".length)
    .split(" ")
    .filter((el) => el !== "")
    .map(Number);

  let product = 1;

  times.forEach((time, i) => {
    const distance = distances[i];
    const roots = solveQuadraticEquation(1, -1 * time, distance);
    const lowestTime = Number.isInteger(roots[0])
      ? roots[0] + 1
      : Math.ceil(roots[0]);
    const highestTime = Number.isInteger(roots[1])
      ? roots[1] - 1
      : Math.floor(roots[1]);
    const number = highestTime - lowestTime + 1;
    product *= number;
  });

  return product;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const time = Number(
    lines[0]
      .slice("Time:".length)
      .split(" ")
      .filter((el) => el !== "")
      .join(""),
  );
  const distance = Number(
    lines[1]
      .slice("Distance:".length)
      .split(" ")
      .filter((el) => el !== "")
      .join(""),
  );

  const roots = solveQuadraticEquation(1, -1 * time, distance);
  const lowestTime = Number.isInteger(roots[0])
    ? roots[0] + 1
    : Math.ceil(roots[0]);
  const highestTime = Number.isInteger(roots[1])
    ? roots[1] - 1
    : Math.floor(roots[1]);
  return highestTime - lowestTime + 1;
};

const input = `Time:      7  15   30
Distance:  9  40  200`;
run({
  part1: {
    tests: [
      {
        input,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
