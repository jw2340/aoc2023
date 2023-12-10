import run from "aocrunner";

// import { promises } from "fs";

// const writeToFile = async (data: string) => {
//   const filePath = "./src/day10/input-1.txt";

//   try {
//     // Use the writeFile function from fs.promises to write the string to the file
//     await promises.writeFile(filePath, data);

//     console.log("Data has been written to the file successfully!");
//   } catch (err) {
//     console.error("Error writing to file:", err);
//   }
// };
// let pipe = "";
// for (const line of grid) {
//   pipe +=
//     line
//       .map((element) => {
//         if (element.visited === false) {
//           return ".";
//         }
//         return element.val;
//       })
//       .join("") + "\n";
// }
// writeToFile(pipe);

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

  // Update S - will have two pipes connected
  // const points = [
  //   [snakeY + 1, snakeX], // down
  //   [snakeY - 1, snakeX], // up
  //   [snakeY, snakeX + 1], // right
  //   [snakeY, snakeX - 1], // left
  // ];

  // up and down are pipes => |
  if (
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY + 1][snakeX].visited === true
  ) {
    grid[snakeY][snakeX].val = "|";
  }
  // left and right are pipes => -
  if (
    grid[snakeY][snakeX - 1].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "-";
  }
  // down and right are pipes => F
  if (
    grid[snakeY + 1][snakeX].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "F";
  }
  // down and left are pipes => J
  if (
    grid[snakeY + 1][snakeX].visited === true &&
    grid[snakeY][snakeX - 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "J";
  }
  // up and right are pipes => L
  if (
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY][snakeX + 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "L";
  }
  // up and left are pipes => 7
  if (
    grid[snakeY - 1][snakeX].visited === true &&
    grid[snakeY][snakeX - 1].visited === true
  ) {
    grid[snakeY][snakeX].val = "7";
  }

  // console.log({ snakeY, snakeX });
  // console.log(grid[snakeY][snakeX].val);

  return grid;
};

const createMemo = (grid: { val: string; visited: boolean }[][]) => {
  const memo: string[][] = [];
  for (let i = 0; i < grid.length; i++) {
    memo.push([]);
    for (let j = 0; j < grid[i].length; j++) {
      memo[i].push("UNVISITED");
    }
  }
  return memo;
};

const oob = (
  grid: { val: string; visited: boolean }[][],
  i: number,
  j: number,
) => {
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

const pathExists = (
  grid: { val: string; visited: boolean }[][],
  i: number,
  j: number,
  memo: string[][],
): boolean => {
  // console.log({ i, j, memo: memo[i][j], val: grid[i][j].val });
  if (oob(grid, i, j)) {
    // console.log("oob");
    return false;
  }

  if (i === 0 || j === 0 || i === grid.length - 1 || j === grid[0].length - 1) {
    // console.log("reached end");
    return true;
  }
  if (memo[i][j] === "NO_PATH_FOUND" || memo[i][j] === "VISITING") {
    // console.log("memo not valid");
    return false;
  }

  memo[i][j] = "VISITING";
  const points = getPoints(i, j);

  for (let l = 0; l < points.length; l++) {
    const point = points[l];
    // console.log({ point });

    // handle current point is pipe
    if (grid[i][j].visited === true) {
      if (grid[i][j].val === "|") {
        if (l === 2 || l == 3) {
          continue;
        }
      }
      if (grid[i][j].val === "-") {
        if (l === 0 || l == 1) {
          continue;
        }
      }
      if (grid[i][j].val === "7") {
        if (l == 2) {
          continue;
        }
      }
      if (grid[i][j].val === "F") {
        if (l == 3) {
          continue;
        }
      }
      if (grid[i][j].val === "J") {
        if (l == 2) {
          continue;
        }
      }
      if (grid[i][j].val === "L") {
        if (l == 3) {
          continue;
        }
      }
    }

    // in between pipes okay
    // point is pipe and next to another pipe that is valid

    // inner tile will follow inner pipe
    // outer tile will follow outer pipe

    // handle open vs closed pipe

    if (grid[point[0]][point[1]].visited === true) {
      // console.log("pipe val");
      const pipeVal = grid[point[0]][point[1]].val;

      // up or down
      if (l === 0 || l == 1) {
        if (pipeVal === "-") {
          continue;
        }
      }
      // right or left
      if (l === 2 || l === 3) {
        if (pipeVal === "|") {
          continue;
        }
      }

      const nextPoints = getPoints(point[0], point[1]);

      for (let k = 0; k < nextPoints.length; k++) {
        const nextPoint = nextPoints[k];
        // console.log({ nextPoint });

        if (grid[nextPoint[0]][nextPoint[1]].visited === true) {
          const nextPipeVal = grid[nextPoint[0]][nextPoint[1]].val;
          // J L
          // - -
          // 7 F

          // below
          if (k === 0) {
            if (
              ["-", "J", "L"].includes(pipeVal) === true &&
              ["7", "F", "-"].includes(nextPipeVal) === true
            ) {
              if (pathExists(grid, point[0], point[1], memo) === true) {
                return true;
              }
            }
          }

          // above
          if (k === 1) {
            if (
              ["7", "F", "-"].includes(pipeVal) === true &&
              ["-", "J", "L"].includes(nextPipeVal) === true
            ) {
              if (pathExists(grid, point[0], point[1], memo) === true) {
                return true;
              }
            }
          }

          // 7 | F
          // J | L

          // right
          if (k === 2) {
            if (
              ["|", "7", "J"].includes(pipeVal) === true &&
              ["|", "F", "L"].includes(nextPipeVal) === true
            ) {
              if (pathExists(grid, point[0], point[1], memo) === true) {
                return true;
              }
            }
          }

          // left
          if (k === 3) {
            if (
              ["|", "F", "L"].includes(pipeVal) === true &&
              ["|", "7", "J"].includes(nextPipeVal) === true
            ) {
              if (pathExists(grid, point[0], point[1], memo) === true) {
                return true;
              }
            }
          }
        }
      }
    } else {
      if (pathExists(grid, point[0], point[1], memo) === true) {
        return true;
      }
    }
  }

  // console.log("no path found");
  memo[i][j] = "NO_PATH_FOUND";
  return false;
};

const countTiles = (grid: { val: string; visited: boolean }[][]) => {
  let sum = 0;
  // const i = 3;
  // const j = 3;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const memo = createMemo(grid);
      if (grid[i][j].visited === false) {
        const isPath = pathExists(grid, i, j, memo);
        console.log({ i, j, isPath });
        if (isPath === false) {
          sum++;
        }
      }
    }
  }
  return sum;
};

const part2 = (rawInput: string) => {
  const grid = populateGrid(rawInput);
  return countTiles(grid);
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

run({
  // part1: {
  //   tests: [
  //     {
  //       input: input1,
  //       expected: 8,
  //     },
  //   ],
  //   solution: part1,
  // },
  part2: {
    tests: [
      // {
      //   input: input1,
      //   expected: 1,
      // },
      // {
      //   input: input2,
      //   expected: 1,
      // },
      // {
      //   input: input3,
      //   expected: 4,
      // },
      // {
      //   input: input4,
      //   expected: 10,
      // },
      {
        input: input5,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
