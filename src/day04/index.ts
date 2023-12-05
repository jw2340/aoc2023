import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let sum = 0;

  lines.forEach((line) => {
    const winningNumbers = line
      .slice(line.indexOf(":") + 2, line.indexOf("|"))
      .split(" ")
      .filter((el) => el !== "")
      .map(Number);
    const numbers = line
      .slice(line.indexOf("|") + 2)
      .split(" ")
      .filter((el) => el !== "")
      .map(Number);

    let winningNumberCount = 0;
    numbers.forEach((num) => {
      if (winningNumbers.includes(num)) {
        winningNumberCount++;
      }
    });

    if (winningNumberCount > 0) {
      sum += Math.pow(2, winningNumberCount - 1);
    }
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const cardCount = Array(lines.length).fill(1);

  lines.forEach((line, cardIdx) => {
    const winningNumbers = line
      .slice(line.indexOf(":") + 2, line.indexOf("|"))
      .split(" ")
      .filter((el) => el !== "")
      .map(Number);
    const numbers = line
      .slice(line.indexOf("|") + 2)
      .split(" ")
      .filter((el) => el !== "")
      .map(Number);

    let winningNumberCount = 0;
    numbers.forEach((num) => {
      if (winningNumbers.includes(num)) {
        winningNumberCount++;
      }
    });

    if (winningNumberCount > 0) {
      for (let i = cardIdx + 1; i <= cardIdx + winningNumberCount; i++) {
        cardCount[i] += cardCount[cardIdx];
      }
    }
  });

  let sum = 0;
  cardCount.forEach((count) => (sum += count));
  return sum;
};

const input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
