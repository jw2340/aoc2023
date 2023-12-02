import run from "aocrunner";
import { objectKeys } from "../utils/index.js";

const COLORS_TO_AMOUNTS = {
  red: 12,
  green: 13,
  blue: 14,
};

const parseInput = (rawInput: string) => rawInput.split("\n");

const parseSets = (line: string) => {
  return line
    .slice(line.indexOf(":") + 2)
    .split("; ")
    .map((set) => set.trim())
    .map((set) => {
      const obj = {
        red: 0,
        green: 0,
        blue: 0,
      };
      set.split(", ").forEach((cube) => {
        const number = Number(cube.split(" ")[0]);
        const color = cube.split(" ")[1] as keyof typeof COLORS_TO_AMOUNTS;
        obj[color] = number;
      });
      return obj;
    });
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line, index) => {
    const sets = parseSets(line);

    const validSets = sets.every((set) => {
      for (const color of objectKeys(set)) {
        if (set[color] > COLORS_TO_AMOUNTS[color]) {
          return false;
        }
      }
      return true;
    });

    if (validSets) {
      const gameId = index + 1;
      sum += gameId;
    }
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line) => {
    const sets = parseSets(line);
    const max = {
      red: 0,
      green: 0,
      blue: 0,
    };
    sets.forEach((set) => {
      for (const color of objectKeys(set)) {
        if (set[color] > max[color]) {
          max[color] = set[color];
        }
      }
    });

    let power = 1;
    for (const color of objectKeys(max)) {
      power *= max[color];
    }
    sum += power;
  });

  return sum;
};

const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
