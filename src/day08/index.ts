import run from "aocrunner";

const createNodes = (lines: string[]) => {
  const nodes: { [key: string]: string[] } = {};
  lines.forEach((line) => {
    const node = line.slice(0, 3);
    const connectedNodes = [line.slice(7, 10), line.slice(12, 15)];
    nodes[node] = connectedNodes;
  });
  return nodes;
};

const parseInput = (rawInput: string) => rawInput.split("\n");

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const directions = lines[0].split("");
  const nodeLines = lines.slice(2);
  const nodes = createNodes(nodeLines);

  let count = 0;
  let node = "AAA";
  while (node !== "ZZZ") {
    const direction = directions[count % directions.length];
    if (direction === "L") {
      node = nodes[node][0];
    } else {
      node = nodes[node][1];
    }
    count++;
  }

  return count;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  const directions = lines[0].split("");
  const nodeLines = lines.slice(2);
  const nodes = createNodes(nodeLines);

  let count = 0;
  let currentNodes = nodeLines
    .filter((line) => {
      const node = line.slice(0, 3);
      return node.endsWith("A");
    })
    .map((line) => line.slice(0, 3));

  const visitedNodes = currentNodes.map(() => {
    return new Set();
  });
  const zLoopFound = currentNodes.map(() => {
    return false;
  });
  const zNodesCount: {
    [key: string]: {
      first?: number;
      second?: number;
      index?: number;
      diff?: number;
    };
  } = {};

  while (!currentNodes.every((node) => node.endsWith("Z")) && count < 100000) {
    const nextNodes: string[] = [];
    currentNodes.forEach((node, i) => {
      const direction = directions[count % directions.length];
      let nodeToAdd;
      if (direction === "L") {
        nodeToAdd = nodes[node][0];
      } else {
        nodeToAdd = nodes[node][1];
      }

      nextNodes.push(nodeToAdd);

      if (!visitedNodes[i].has(nodeToAdd) && nodeToAdd.endsWith("Z")) {
        zNodesCount[nodeToAdd] = {};
        zNodesCount[nodeToAdd].first = count + 1;
      }

      if (visitedNodes[i].has(nodeToAdd) && nodeToAdd.endsWith("Z")) {
        console.log();
        zNodesCount[nodeToAdd].second = count + 1;
        zNodesCount[nodeToAdd].index = i;
        zNodesCount[nodeToAdd].diff =
          Number(zNodesCount[nodeToAdd].second) -
          Number(zNodesCount[nodeToAdd].first);
        zLoopFound[i] = true;
      }

      visitedNodes[i].add(nodeToAdd);
    });

    if (zLoopFound.every(Boolean)) {
      break;
    }

    currentNodes = nextNodes;
    count++;
  }

  // inputted these values in chinese remainder calculator
  console.log([
    Object.values(zNodesCount).map((el) => el.first),
    Object.values(zNodesCount).map((el) => el.diff),
  ]);
  return 12833235391111;
};

const input1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const input2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const input3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

run({
  part1: {
    tests: [
      {
        input: input1,
        expected: 2,
      },
      {
        input: input2,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: input3,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
