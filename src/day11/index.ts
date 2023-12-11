import run from "aocrunner";
import { writeToFile } from "../utils/index.js";

const parseInput = (rawInput: string) => rawInput.split("\n");

const EMPTY_SPACE = ".";
const GALAXY = "#";

type Coordinates = { i: number; j: number };

const saveFile = (space: string[][], filePath: string) => {
  let pipe = "";
  for (const line of space) {
    pipe += line.join("") + "\n";
  }
  writeToFile(pipe, filePath);
};

const expandSpace = (lines: string[]) => {
  const expandedSpace = [];

  for (let i = 0; i < lines.length; i++) {
    const elements = lines[i].split("");
    expandedSpace.push([...elements]);
    const noGalaxies = elements.every((el) => el === EMPTY_SPACE);
    if (noGalaxies) {
      // add a second row
      expandedSpace.push([...elements]);
    }
  }

  for (let j = expandedSpace[0].length - 1; j >= 0; j--) {
    let noGalaxies = true;
    for (let i = 0; i < expandedSpace.length; i++) {
      if (expandedSpace[i][j] === GALAXY) {
        noGalaxies = false;
      }
    }
    if (noGalaxies) {
      expandedSpace.forEach((elements, row) => {
        const line = elements.join("");
        let expandedRow: string;
        // add additional column to row
        if (j === line.length - 1) {
          expandedRow = line + EMPTY_SPACE;
        } else if (j === 0) {
          expandedRow = EMPTY_SPACE + line;
        } else {
          expandedRow =
            line.slice(0, j + 1) + EMPTY_SPACE + line.slice(j + 1, line.length);
        }
        expandedSpace[row] = expandedRow.split("");
      });
    }
  }
  // saveFile(expandedSpace, "./src/day11/test.txt");
  return expandedSpace;
};

const getExpandedRowsAndCols = (lines: string[]) => {
  const rows: Set<number> = new Set();
  const cols: Set<number> = new Set();

  for (let i = 0; i < lines.length; i++) {
    const elements = lines[i].split("");
    const noGalaxies = elements.every((el) => el === EMPTY_SPACE);
    if (noGalaxies) {
      rows.add(i);
    }
  }

  for (let j = lines[0].length - 1; j >= 0; j--) {
    let noGalaxies = true;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i][j] === GALAXY) {
        noGalaxies = false;
      }
    }
    if (noGalaxies) {
      cols.add(j);
    }
  }
  return { rows, cols };
};

const getGalaxies = (space: string[][]) => {
  const galaxies: Coordinates[] = [];
  space.forEach((row, i) => {
    row.forEach((el, j) => {
      if (el === GALAXY) {
        galaxies.push({ i, j });
      }
    });
  });
  return galaxies;
};

const getDistance = (
  coordA: Coordinates,
  coordB: Coordinates,
  expand = false,
  expandedRowsAndCols?: { rows: Set<number>; cols: Set<number> },
) => {
  if (expand && expandedRowsAndCols) {
    let distance =
      Math.abs(coordA.i - coordB.i) + Math.abs(coordA.j - coordB.j);
    const { rows, cols } = expandedRowsAndCols;
    for (const row of Array.from(rows)) {
      const min = Math.min(coordA.i, coordB.i);
      const max = Math.max(coordA.i, coordB.i);
      if (row >= min && row <= max && min !== max) {
        // distance += 99;
        distance += 999999;
      }
    }
    for (const col of Array.from(cols)) {
      const min = Math.min(coordA.j, coordB.j);
      const max = Math.max(coordA.j, coordB.j);
      if (col >= min && col <= max && min !== max) {
        // distance += 99;
        distance += 999999;
      }
    }
    return distance;
  }
  return Math.abs(coordA.i - coordB.i) + Math.abs(coordA.j - coordB.j);
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const expandedSpace = expandSpace(lines);
  const galaxies = getGalaxies(expandedSpace);

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const distance = getDistance(galaxies[i], galaxies[j]);
      sum += distance;
    }
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const { rows, cols } = getExpandedRowsAndCols(lines);
  const galaxies = getGalaxies(lines.map((line) => line.split("")));

  let sum = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const distance = getDistance(galaxies[i], galaxies[j], true, {
        rows,
        cols,
      });
      sum += distance;
    }
  }

  return sum;
};

const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
