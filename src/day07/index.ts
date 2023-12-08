import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n");

const CARDS_BY_STRENGTH = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
].reverse();

const HANDS_TO_POINTS = {
  FIVE_OF_A_KIND: 7,
  FOUR_OF_A_KIND: 6,
  FULL_HOUSE: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1,
};

const getPoints = (cards: string[]) => {
  const cardsFrequency: { [key: string]: number } = {};
  cards.forEach((card) => {
    if (cardsFrequency[card]) {
      cardsFrequency[card]++;
    } else {
      cardsFrequency[card] = 1;
    }
  });

  const numUniqueCards = Object.keys(cardsFrequency).length;

  const cardsFrequencyNoJoker = Object.assign({}, cardsFrequency);
  delete cardsFrequencyNoJoker["J"];

  const maxFrequency = Math.max(...Object.values(cardsFrequencyNoJoker));
  const hasJoker = cardsFrequency["J"] !== undefined;
  const jokerFrequency = cardsFrequency["J"];

  if (!hasJoker) {
    if (numUniqueCards === 1) {
      return HANDS_TO_POINTS.FIVE_OF_A_KIND;
    } else if (numUniqueCards === 2) {
      if (maxFrequency === 4) {
        return HANDS_TO_POINTS.FOUR_OF_A_KIND;
      }
      return HANDS_TO_POINTS.FULL_HOUSE;
    } else if (numUniqueCards === 3) {
      if (maxFrequency === 3) {
        return HANDS_TO_POINTS.THREE_OF_A_KIND;
      }
      return HANDS_TO_POINTS.TWO_PAIR;
    } else if (numUniqueCards === 4) {
      return HANDS_TO_POINTS.ONE_PAIR;
    } else if (numUniqueCards === 5) {
      return HANDS_TO_POINTS.HIGH_CARD;
    }
  }

  if (numUniqueCards === 1) {
    return HANDS_TO_POINTS.FIVE_OF_A_KIND;
  } else if (numUniqueCards === 2) {
    if (maxFrequency === 4 && jokerFrequency === 1) {
      return HANDS_TO_POINTS.FIVE_OF_A_KIND;
    }
    if (maxFrequency === 3 && jokerFrequency === 2) {
      return HANDS_TO_POINTS.FIVE_OF_A_KIND;
    }
    if (maxFrequency === 1 && jokerFrequency === 4) {
      return HANDS_TO_POINTS.FIVE_OF_A_KIND;
    }
    return HANDS_TO_POINTS.FULL_HOUSE;
  } else if (numUniqueCards === 3) {
    if (maxFrequency === 3 && jokerFrequency === 2) {
      return HANDS_TO_POINTS.FIVE_OF_A_KIND;
    }
    if (maxFrequency === 3 && jokerFrequency === 1) {
      return HANDS_TO_POINTS.FOUR_OF_A_KIND;
    }
    if (maxFrequency === 2 && jokerFrequency === 2) {
      return HANDS_TO_POINTS.FOUR_OF_A_KIND;
    }
    if (maxFrequency === 2 && jokerFrequency === 1) {
      // full house
      if (
        Object.values(cardsFrequencyNoJoker).filter((el) => el === 2).length ===
        2
      ) {
        return HANDS_TO_POINTS.FULL_HOUSE;
      }

      return HANDS_TO_POINTS.THREE_OF_A_KIND;
    }
    if (maxFrequency === 1 && jokerFrequency === 3) {
      return HANDS_TO_POINTS.FOUR_OF_A_KIND;
    }

    if (maxFrequency === 3) {
      return HANDS_TO_POINTS.THREE_OF_A_KIND;
    }
    return HANDS_TO_POINTS.TWO_PAIR;
  } else if (numUniqueCards === 4) {
    // 2 Jokers and 1 card
    // 1 Joker and 2 same cards
    return HANDS_TO_POINTS.THREE_OF_A_KIND;
  } else if (numUniqueCards === 5) {
    // must include joker
    return HANDS_TO_POINTS.ONE_PAIR;
  }

  throw Error("Unreachable");
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const hands = lines.map((line) => {
    const cards = line.slice(0, 5).split("");
    const bid = Number(line.slice(6).trim());
    const points = getPoints(cards);
    return { cards, points, bid };
  });

  hands.sort((handA, handB) => {
    if (handA.points > handB.points) {
      return 1;
    }
    if (handA.points < handB.points) {
      return -1;
    }

    for (let i = 0; i < handA.cards.length; i++) {
      const cardA = handA.cards[i];
      const cardB = handB.cards[i];
      const strengthA = CARDS_BY_STRENGTH.indexOf(cardA);
      const strengthB = CARDS_BY_STRENGTH.indexOf(cardB);

      if (strengthA > strengthB) {
        return 1;
      }
      if (strengthA < strengthB) {
        return -1;
      }
    }
    throw Error("Unreachable");
  });

  let winnings = 0;
  hands.forEach((hand, i) => {
    winnings += hand.bid * (i + 1);
  });

  return winnings;
};

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 5905,
      },
    ],
    solution: part1,
  },
  trimTestInputs: true,
  onlyTests: false,
});
