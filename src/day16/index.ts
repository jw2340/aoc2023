import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const RIGHT = "R" as const;
const LEFT = "L" as const;
const UP = "U" as const;
const DOWN = "D" as const;

const DIRECTIONS = [RIGHT, LEFT, UP, DOWN] as const;
type Direction = (typeof DIRECTIONS)[number];
type Grid = {
  val: string;
  dir?: Direction;
}[][];
type Point = { i: number; j: number };

const getNextPoint = (point: Point, direction: Direction) => {
  let i = point.i;
  let j = point.j;
  if (direction === RIGHT) {
    j++;
  }
  if (direction === LEFT) {
    j--;
  }
  if (direction === DOWN) {
    i++;
  }
  if (direction === UP) {
    i--;
  }
  return { i, j };
};

const oob = (grid: Grid, i: number, j: number) => {
  return i < 0 || j < 0 || i >= grid.length || j >= grid[0].length;
};

const getNextDirection = (val: "\\" | "/", direction: Direction) => {
  if (val === "\\") {
    const nextDirections = {
      R: DOWN,
      L: UP,
      U: LEFT,
      D: RIGHT,
    } as const;
    return nextDirections[direction];
  }
  if (val === "/") {
    const nextDirections = {
      R: UP,
      L: DOWN,
      U: RIGHT,
      D: LEFT,
    } as const;
    return nextDirections[direction];
  }
  throw Error("Unreachable");
};

const getNeighbors = (grid: Grid, point: Point, direction: Direction) => {
  const val = grid[point.i][point.j].val;
  const neighbors = [];
  if (val === ".") {
    neighbors.push({ point: getNextPoint(point, direction), direction });
  }
  if (val === "-") {
    if (direction === RIGHT || direction === LEFT) {
      neighbors.push({ point: getNextPoint(point, direction), direction });
    } else {
      neighbors.push({ point: getNextPoint(point, RIGHT), direction: RIGHT });
      neighbors.push({ point: getNextPoint(point, LEFT), direction: LEFT });
    }
  }
  if (val === "|") {
    if (direction === UP || direction === DOWN) {
      neighbors.push({ point: getNextPoint(point, direction), direction });
    } else {
      neighbors.push({ point: getNextPoint(point, UP), direction: UP });
      neighbors.push({ point: getNextPoint(point, DOWN), direction: DOWN });
    }
  }
  if (val === "\\" || val === "/") {
    const nextDirection = getNextDirection(val, direction);
    neighbors.push({
      point: getNextPoint(point, nextDirection),
      direction: nextDirection,
    });
  }
  return neighbors;
};

const dfs = (grid: Grid, point: Point, direction: Direction) => {
  if (oob(grid, point.i, point.j)) {
    return;
  }
  if (grid[point.i][point.j].dir === direction) {
    return;
  }
  grid[point.i][point.j].dir = direction;

  const neighbors = getNeighbors(grid, point, direction);
  for (const neighbor of neighbors) {
    dfs(grid, neighbor.point, neighbor.direction);
  }
};

const createGrid = (lines: string[]): Grid => {
  const grid = [];
  for (const line of lines) {
    grid.push(
      line.split("").map((el) => {
        return {
          val: el,
          dir: undefined,
        };
      }),
    );
  }
  return grid;
};

const getSum = (grid: Grid) =>
  grid.reduce((acc, line) => {
    return acc + line.filter((el) => el.dir).length;
  }, 0);

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const grid = createGrid(lines);

  const start = { i: 0, j: 0 };
  const direction = RIGHT;
  dfs(grid, start, direction);

  return getSum(grid);
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let max = 0;
  let grid = createGrid(lines);
  for (let i = 0; i < grid.length; i++) {
    dfs(grid, { i, j: 0 }, RIGHT);
    let sum = getSum(grid);
    max = Math.max(max, sum);
    grid = createGrid(lines);

    dfs(grid, { i, j: grid[0].length - 1 }, LEFT);
    sum = getSum(grid);
    max = Math.max(max, sum);
    grid = createGrid(lines);
  }

  for (let j = 0; j < grid[0].length; j++) {
    dfs(grid, { i: 0, j }, DOWN);
    let sum = getSum(grid);
    max = Math.max(max, sum);
    grid = createGrid(lines);

    dfs(grid, { i: grid.length - 1, j }, UP);
    sum = getSum(grid);
    max = Math.max(max, sum);
    grid = createGrid(lines);
  }

  return max;
};

const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
