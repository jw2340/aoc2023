import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const OPERATIONAL = ".";
const DAMAGED = "#";
const UNKNOWN = "?";

const getPermutationsHelper = (
  buffer: string[],
  length: number,
  result: string[][],
) => {
  if (buffer.length === length) {
    return result.push([...buffer]);
  }
  const possibleConditions = [OPERATIONAL, DAMAGED];
  for (const condition of possibleConditions) {
    buffer.push(condition);
    getPermutationsHelper(buffer, length, result);
    buffer.pop();
  }
};

const getPermutations = (count: number) => {
  const buffer: string[] = [];
  const result: string[][] = [];
  getPermutationsHelper(buffer, count, result);
  return result;
};

const getValidPermutations = (
  permutations: string[][],
  conditions: string[],
  groups: number[],
) => {
  return permutations
    .map((permutation) => {
      const output: string[] = [];
      let i = 0;
      conditions.forEach((el) => {
        if (el === UNKNOWN) {
          output.push(permutation[i]);
          i++;
        } else {
          output.push(el);
        }
      });
      return output;
    })
    .filter((output) => {
      let currentGroupIndex = 0;
      let damagedCount = 0;
      let foundDamaged = false;
      for (let i = 0; i < output.length; i++) {
        const el = output[i];
        if (el === DAMAGED) {
          if (!foundDamaged) {
            foundDamaged = true;
          }
          damagedCount++;
        } else {
          if (foundDamaged) {
            if (damagedCount !== groups[currentGroupIndex]) {
              return false;
            }
            foundDamaged = false;
            damagedCount = 0;
            currentGroupIndex++;
          }
        }
      }
      if (foundDamaged) {
        if (damagedCount !== groups[currentGroupIndex]) {
          return false;
        }
        if (currentGroupIndex !== groups.length - 1) {
          return false;
        }
      } else {
        if (currentGroupIndex !== groups.length) {
          return false;
        }
      }
      return true;
    });
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput).map((line) => {
    const [conditions, groups] = line.split(" ");
    return {
      conditions: conditions.split(""),
      groups: groups.split(",").map(Number),
    };
  });

  let sum = 0;
  lines.forEach((line) => {
    const { conditions, groups } = line;
    const unknownCount = conditions.filter((el) => el === UNKNOWN).length;
    const permutations = getPermutations(unknownCount);
    const validPermutations = getValidPermutations(
      permutations,
      conditions,
      groups,
    );
    sum += validPermutations.length;
  });
  return sum;
};

const getSum = (arr: number[]) => {
  return arr.reduce((acc, el) => {
    return acc + el;
  }, 0);
};

const countElements = (arr: string[], elements: string[]) => {
  return arr.reduce((acc, el) => {
    if (elements.includes(el)) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const countDamaged = (
  conditions: string[],
  groups: number[],
  memo: { [key: string]: number },
): number => {
  // check next group does not have "."
  if (conditions.slice(0, groups[0]).includes(OPERATIONAL)) {
    return 0;
  }
  // check if not at end of condition
  if (conditions.length > groups[0]) {
    // check there is no "#" after group
    if (conditions[groups[0]] === DAMAGED) {
      return 0;
    }
  }
  // if at end of condition
  // assume last element is "."
  return getCount(conditions.slice(groups[0] + 1), groups.slice(1), memo);
};

const getCount = (
  conditions: string[],
  groups: number[],
  memo: { [key: string]: number },
): number => {
  const memoKey = conditions.join(",") + groups.join("");
  if (memo[memoKey] !== undefined) {
    return memo[memoKey];
  }
  const damagedAndUnknownCount = countElements(conditions, [DAMAGED, UNKNOWN]);
  const damagedCount = countElements(conditions, [DAMAGED]);
  const groupSum = getSum(groups);

  if (groupSum > damagedAndUnknownCount) return 0;
  if (damagedCount > groupSum) return 0;
  if (groupSum === 0) return 1;

  const condition = conditions[0];
  if (condition === OPERATIONAL) {
    const result = getCount(conditions.slice(1), groups, memo);
    memo[memoKey] = result;
    return result;
  }

  if (condition === DAMAGED) {
    const result = countDamaged(conditions, groups, memo);
    memo[memoKey] = result;
    return result;
  }
  if (condition === UNKNOWN) {
    const result =
      getCount(conditions.slice(1), groups, memo) +
      countDamaged(conditions, groups, memo);
    memo[memoKey] = result;
    return result;
  }
  throw Error("Unreachable");
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput).map((line) => {
    const [conditions, groups] = line.split(" ");
    return {
      conditions: Array(5).fill(conditions).join("?").split(""),
      groups: Array(5).fill(groups).join(",").split(",").map(Number),
    };
  });

  let sum = 0;
  lines.forEach((line) => {
    const { conditions, groups } = line;
    const memo: { [key: string]: number } = {};
    sum += getCount(conditions, groups, memo);
  });
  return sum;
};

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
