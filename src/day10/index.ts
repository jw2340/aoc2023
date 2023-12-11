import run from "aocrunner";

import { promises } from "fs";

const writeToFile = async (data: string, filePath: string) => {
  try {
    // Use the writeFile function from fs.promises to write the string to the file
    await promises.writeFile(filePath, data);

    console.log("Data has been written to the file successfully!");
  } catch (err) {
    console.error("Error writing to file:", err);
  }
};

const saveFile = (grid: Grid, filePath: string) => {
  let pipe = "";
  for (const line of grid) {
    pipe +=
      line
        .map((element) => {
          return element.val;
        })
        .join("") + "\n";
  }
  writeToFile(pipe, filePath);
};

type Grid = { val: string; visited: boolean }[][];

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const grid = lines.map((line, i) => {
    return line.split("").map((val) => ({ val, visited: false }));
  });

  let snakeX = undefined;
  let snakeY = undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const maybeSnakeX = line.indexOf("S");
    if (maybeSnakeX > -1) {
      snakeX = maybeSnakeX;
      snakeY = i;
    }
  }

  if (snakeX === undefined || snakeY === undefined) {
    throw Error("Unreachable");
  }

  let currentX = snakeX;
  let currentY = snakeY;
  let count = 0;

  do {
    const currentVal = grid[currentY][currentX].val;

    // curr | 7 F
    // down | J L
    if (
      currentY !== grid.length - 1 &&
      ["|", "7", "F", "S"].includes(currentVal)
    ) {
      const down = grid[currentY + 1][currentX];
      if (down.visited === false) {
        if (down.val === "|" || down.val === "J" || down.val === "L") {
          currentY += 1;
          grid[currentY][currentX].visited = true;
          count++;
          continue;
        }
      }
    }
    // curr | J L
    // up | F 7
    if (currentY > 0 && ["|", "J", "L", "S"].includes(currentVal)) {
      const up = grid[currentY - 1][currentX];
      if (up.visited === false) {
        if (up.val === "|" || up.val === "F" || up.val === "7") {
          currentY -= 1;
          grid[currentY][currentX].visited = true;
          count++;
          continue;
        }
      }
    }

    // curr - 7 J
    // left - L F
    if (currentX > 0 && ["-", "7", "J", "S"].includes(currentVal)) {
      const left = grid[currentY][currentX - 1];
      if (left.visited === false) {
        if (left.val === "-" || left.val === "L" || left.val === "F") {
          currentX -= 1;
          grid[currentY][currentX].visited = true;
          count++;
          continue;
        }
      }
    }

    // curr - F L
    // right - 7 J
    if (
      currentX !== grid[currentY].length - 1 &&
      ["-", "F", "L", "S"].includes(currentVal)
    ) {
      const right = grid[currentY][currentX + 1];
      if (right.visited === false) {
        if (right.val === "-" || right.val === "7" || right.val === "J") {
          currentX += 1;
          grid[currentY][currentX].visited = true;
          count++;
          continue;
        }
      }
    }
    break;
  } while (!(currentX === snakeX && currentY == snakeY));

  return Math.ceil(count / 2);
};

const populateGrid = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const grid = lines.map((line, i) => {
    return line.split("").map((val) => ({ val, visited: false }));
  });

  let snakeX = undefined;
  let snakeY = undefined;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const maybeSnakeX = line.indexOf("S");
    if (maybeSnakeX > -1) {
      snakeX = maybeSnakeX;
      snakeY = i;
    }
  }

  if (snakeX === undefined || snakeY === undefined) {
    throw Error("Unreachable");
  }

  let currentX = snakeX;
  let currentY = snakeY;

  do {
    const currentVal = grid[currentY][currentX].val;

    // curr | 7 F
    // down | J L
    if (
      currentY !== grid.length - 1 &&
      ["|", "7", "F", "S"].includes(currentVal)
    ) {
      const down = grid[currentY + 1][currentX];
      if (down.visited === false) {
        if (down.val === "|" || down.val === "J" || down.val === "L") {
          currentY += 1;
          grid[currentY][currentX].visited = true;
          continue;
        }
      }
    }
    // curr | J L
    // up | F 7
    if (currentY > 0 && ["|", "J", "L", "S"].includes(currentVal)) {
      const up = grid[currentY - 1][currentX];
      if (up.visited === false) {
        if (up.val === "|" || up.val === "F" || up.val === "7") {
          currentY -= 1;
          grid[currentY][currentX].visited = true;
          continue;
        }
      }
    }

    // curr - 7 J
    // left - L F
    if (currentX > 0 && ["-", "7", "J", "S"].includes(currentVal)) {
      const left = grid[currentY][currentX - 1];
      if (left.visited === false) {
        if (left.val === "-" || left.val === "L" || left.val === "F") {
          currentX -= 1;
          grid[currentY][currentX].visited = true;
          continue;
        }
      }
    }

    // curr - F L
    // right - 7 J
    if (
      currentX !== grid[currentY].length - 1 &&
      ["-", "F", "L", "S"].includes(currentVal)
    ) {
      const right = grid[currentY][currentX + 1];
      if (right.visited === false) {
        if (right.val === "-" || right.val === "7" || right.val === "J") {
          currentX += 1;
          grid[currentY][currentX].visited = true;
          continue;
        }
      }
    }
    break;
  } while (!(currentX === snakeX && currentY == snakeY));

  grid[snakeY][snakeX].visited = true;

  // up and down are pipes => |
  if (
    !oob(grid, snakeY - 1, snakeX) &&
    !oob(grid, snakeY + 1, snakeX) &&
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY + 1][snakeX].visited === true
  ) {
    grid[snakeY][snakeX].val = "|";
  }
  // left and right are pipes => -
  if (
    !oob(grid, snakeY, snakeX - 1) &&
    !oob(grid, snakeY, snakeX + 1) &&
    grid[snakeY][snakeX - 1].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "-";
  }
  // down and right are pipes => F
  if (
    !oob(grid, snakeY + 1, snakeX) &&
    !oob(grid, snakeY, snakeX + 1) &&
    grid[snakeY + 1][snakeX].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "F";
  }
  // down and left are pipes => J
  if (
    !oob(grid, snakeY + 1, snakeX) &&
    !oob(grid, snakeY, snakeX - 1) &&
    grid[snakeY + 1][snakeX].visited === true &&
    grid[snakeY][snakeX - 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "J";
  }
  // up and right are pipes => L
  if (
    !oob(grid, snakeY - 1, snakeX) &&
    !oob(grid, snakeY, snakeX + 1) &&
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "L";
  }
  // up and left are pipes => 7
  if (
    !oob(grid, snakeY - 1, snakeX) &&
    !oob(grid, snakeY, snakeX - 1) &&
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY][snakeX - 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "7";
  }

  return grid;
};

const oob = (grid: Grid, i: number, j: number) => {
  return i < 0 || j < 0 || i >= grid.length || j >= grid[0].length;
};

const getPoints = (i: number, j: number) => {
  return [
    [i + 1, j], // down
    [i - 1, j], // up
    [i, j + 1], // right
    [i, j - 1], // left
  ];
};

const bfs = (grid: Grid, i: number, j: number) => {
  const queue: { i: number; j: number }[] = [];
  queue.push({ i, j });
  grid[i][j].val = "O";

  while (queue.length > 0) {
    const node = queue.shift();
    if (node === undefined) {
      throw Error("Unreachable");
    }
    const points = getPoints(node.i, node.j);
    for (const point of points) {
      if (!oob(grid, point[0], point[1])) {
        const cell = grid[point[0]][point[1]];
        if (cell.val !== "O" && cell.visited === false) {
          queue.push({ i: point[0], j: point[1] });
          cell.val = "O";
        }
      }
    }
  }
};

const markGrid = (grid: Grid) => {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    let numWalls = 0;
    let currentWall;

    for (let j = 0; j < grid[0].length; j++) {
      const cell = grid[i][j];
      if (cell.visited === false && cell.val != "O") {
        if (numWalls % 2 === 0) {
          cell.val = "O";
        } else {
          cell.val = "*";
          count++;
        }
        // F---7 and L---J => two walls
        // F--J and L--7 => one wall
      } else if (cell.visited === true) {
        if (cell.val === "|") {
          numWalls += 1;
          currentWall = "|";
        } else if (cell.val === "L") {
          currentWall = "L";
        } else if (cell.val === "F") {
          currentWall = "F";
        } else if (cell.val === "7") {
          if (currentWall === "F") {
            numWalls += 2;
          }
          if (currentWall === "L") {
            numWalls += 1;
          }
          currentWall = "7";
        } else if (cell.val === "J") {
          if (currentWall === "F") {
            numWalls += 1;
          }
          if (currentWall === "L") {
            numWalls += 2;
          }
          currentWall = "J";
        }
      }
    }
  }
  return count;
};

const part2 = (rawInput: string) => {
  const grid = populateGrid(rawInput);
  bfs(grid, 0, 0);
  const count = markGrid(grid);
  // saveFile(grid, "./src/day10/test.txt");
  return count;
};

const input1 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const input2 = `-L|F7
7S-7|
L|7||
-L-J|
L|-JF`;

const input3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const input4 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const input5 = `..........
.S------7.
.|F----7|.
.||OOOO||.
.||OOOO||.
.|L-7F-J|.
.|II||II|.
.L--JL--J.
..........`;

const input6 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

run({
  part1: {
    tests: [
      {
        input: input1,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input1,
        expected: 1,
      },
      {
        input: input2,
        expected: 1,
      },
      {
        input: input3,
        expected: 4,
      },
      {
        input: input4,
        expected: 8,
      },
      {
        input: input5,
        expected: 4,
      },
      {
        input: input6,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
