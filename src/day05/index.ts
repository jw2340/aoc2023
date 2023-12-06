import run from "aocrunner";
import { arrayDifference } from "interval-operations";

type IntervalPoint = number;
type Interval<T extends IntervalPoint = IntervalPoint> = [T, T];

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const seeds = lines[0].slice("seeds: ".length).split(" ").map(Number);

  let previousArray = [...seeds];
  let currentArray = Array(seeds.length).fill(null);

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("map")) {
      continue;
    }

    const [destinationStart, sourceStart, range] = line.split(" ").map(Number);
    previousArray.forEach((el, j) => {
      if (el >= sourceStart && el < sourceStart + range) {
        const diff = destinationStart - sourceStart;
        currentArray[j] = el + diff;
      }
    });

    if (line === "" || i === lines.length - 1) {
      currentArray.forEach((el, j) => {
        if (el === null) {
          currentArray[j] = previousArray[j];
        }
      });
      previousArray = [...currentArray];
      currentArray = Array(seeds.length).fill(null);
      continue;
    }
  }

  let min = Number.MAX_SAFE_INTEGER;
  previousArray.forEach((el) => {
    if (el < min) {
      min = el;
    }
  });

  return min;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const seedRanges = lines[0].slice("seeds: ".length).split(" ").map(Number);

  let current: Interval[] = [];
  let currentProcessed: Interval[] = [];
  let previous: Interval[] = [];

  for (let i = 0; i < seedRanges.length; i += 2) {
    previous.push([seedRanges[i], seedRanges[i] + seedRanges[i + 1] - 1]);
  }

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("map")) {
      continue;
    }

    if (line !== "") {
      const [destinationStart, sourceStart, range] = line
        .split(" ")
        .map(Number);

      for (let j = 0; j < previous.length; j += 1) {
        const start = previous[j][0];
        const end = previous[j][1];

        // start and end within range
        if (
          start >= sourceStart &&
          // start < sourceStart + range &&
          end < sourceStart + range
        ) {
          current.push([
            start + destinationStart - sourceStart,
            end + destinationStart - sourceStart,
          ]);

          currentProcessed.push([start, end]);
        }
        // only start within range
        if (
          start >= sourceStart &&
          start < sourceStart + range &&
          end >= sourceStart + range
        ) {
          current.push([
            start + destinationStart - sourceStart,
            destinationStart + range - 1,
          ]);

          currentProcessed.push([start, sourceStart + range - 1]);
        }
        // only end within range
        if (
          start < sourceStart &&
          end >= sourceStart &&
          end < sourceStart + range
        ) {
          current.push([
            destinationStart,
            end + destinationStart - sourceStart,
          ]);

          currentProcessed.push([sourceStart, end]);
        }
      }
    }

    if (line === "" || i === lines.length - 1) {
      // check where previous ranges do not overlap with current ranges
      const diff = arrayDifference(previous, currentProcessed);

      previous = [...current, ...diff];
      current = [];
      currentProcessed = [];
      continue;
    }
  }

  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < previous.length; i++) {
    const start = previous[i][0];
    // not sure why there was a start of 0
    if (start < min && start > 0) {
      min = start;
    }
  }
  return min;
};

const input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
