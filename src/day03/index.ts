import run from "aocrunner";
import { isNumber, objectKeys } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n");

const isSymbol = (char: string): boolean => {
  return !isNumber(char) && char !== ".";
};

const isAdjacentToSymbol = (
  targetRow: number,
  targetCol: number,
  lines: string[],
): boolean => {
  return [
    [targetRow + 1, targetCol],
    [targetRow + 1, targetCol + 1],
    [targetRow + 1, targetCol - 1],
    [targetRow - 1, targetCol],
    [targetRow - 1, targetCol + 1],
    [targetRow - 1, targetCol - 1],
    [targetRow, targetCol + 1],
    [targetRow, targetCol - 1],
  ].some(([row, col]) => {
    if (
      row < 0 ||
      col < 0 ||
      row > lines[0].length - 1 ||
      col > lines.length - 1
    ) {
      return false;
    }
    return isSymbol(lines[row][col]);
  });
};

const isPartNumber = (
  row: number,
  colStart: number,
  colEnd: number,
  lines: string[],
): boolean => {
  for (let col = colStart; col <= colEnd; col++) {
    if (isAdjacentToSymbol(row, col, lines)) {
      return true;
    }
  }
  return false;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line, row) => {
    const values = line.split("");
    let currentNumString = "";
    let currentNumStart: number | undefined;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (isNumber(value)) {
        if (currentNumStart === undefined) {
          currentNumStart = i;
        }
        currentNumString += value;
      }

      if (
        // end of line
        i === values.length - 1 ||
        // end of number on line
        (i < values.length - 1 && !isNumber(values[i + 1]))
      ) {
        if (currentNumStart !== undefined && currentNumString !== "") {
          if (isPartNumber(row, currentNumStart, i, lines)) {
            sum += Number(currentNumString);
          }
          // reset
          currentNumString = "";
          currentNumStart = undefined;
        }
      }
    }
  });

  return sum;
};

const getGearPosition = (
  targetRow: number,
  targetCol: number,
  lines: string[],
) => {
  let gearPosition: undefined | { row: number; col: number };
  [
    [targetRow + 1, targetCol],
    [targetRow + 1, targetCol + 1],
    [targetRow + 1, targetCol - 1],
    [targetRow - 1, targetCol],
    [targetRow - 1, targetCol + 1],
    [targetRow - 1, targetCol - 1],
    [targetRow, targetCol + 1],
    [targetRow, targetCol - 1],
  ].forEach(([row, col]) => {
    if (
      row < 0 ||
      col < 0 ||
      row > lines[0].length - 1 ||
      col > lines.length - 1
    ) {
      return false;
    }
    if (lines[row][col] === "*") {
      gearPosition = { row, col };
    }
  });

  return gearPosition;
};

const getGearPositionForPart = (
  row: number,
  colStart: number,
  colEnd: number,
  lines: string[],
) => {
  for (let col = colStart; col <= colEnd; col++) {
    const gearPosition = getGearPosition(row, col, lines);
    if (gearPosition !== undefined) {
      return gearPosition;
    }
  }
  return undefined;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const GEARS_TO_PART_NUMBERS: { [key: string]: number[] } = {};

  lines.forEach((line, row) => {
    const values = line.split("");
    let currentNumString = "";
    let currentNumStart: number | undefined;

    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (isNumber(value)) {
        if (currentNumStart === undefined) {
          currentNumStart = i;
        }
        currentNumString += value;
      }

      if (
        // end of line
        i === values.length - 1 ||
        // end of number on line
        (i < values.length - 1 && !isNumber(values[i + 1]))
      ) {
        if (currentNumStart !== undefined && currentNumString !== "") {
          const gearPosition = getGearPositionForPart(
            row,
            currentNumStart,
            i,
            lines,
          );
          if (gearPosition !== undefined) {
            const gearIndex = gearPosition.row + "," + gearPosition.col;
            if (!GEARS_TO_PART_NUMBERS[gearIndex]) {
              GEARS_TO_PART_NUMBERS[gearIndex] = [];
            }
            GEARS_TO_PART_NUMBERS[gearIndex].push(Number(currentNumString));
          }
          // reset
          currentNumString = "";
          currentNumStart = undefined;
        }
      }
    }
  });

  let sum = 0;
  for (const gearIndex of objectKeys(GEARS_TO_PART_NUMBERS)) {
    const parts = GEARS_TO_PART_NUMBERS[gearIndex];
    if (parts.length === 2) {
      const ratio = parts[0] * parts[1];
      sum += ratio;
    }
  }

  return sum;
};

const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
