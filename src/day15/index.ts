import run from "aocrunner";
import { List, Item } from "linked-list";

const parseInput = (rawInput: string) => rawInput.split(",");

const getHash = (chars: string[]) => {
  let hash = 0;
  for (const char of chars) {
    hash += char.charCodeAt(0);
    hash *= 17;
    hash = hash % 256;
  }
  return hash;
};

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  let sum = 0;
  for (const line of lines) {
    const chars = line.split("");
    const hash = getHash(chars);
    sum += hash;
  }

  return sum;
};

const EQUAL = "=";
const DASH = "-";

class Node extends Item {
  value: number;
  constructor(value: number) {
    super();
    this.value = value;
  }
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const boxes: { list: List<Node>; map: Map<string, Node> }[] = [];
  for (let i = 0; i < 256; i++) {
    boxes.push({
      list: new List(),
      map: new Map(),
    });
  }

  for (const line of lines) {
    if (line.includes(EQUAL)) {
      const [label, focalLengthString] = line.split(EQUAL);
      const focalLength = Number(focalLengthString);
      const hash = getHash(label.split(""));
      const box = boxes[hash];
      // if it already exists, update focal length
      if (box.map.has(label)) {
        const node = box.map.get(label);
        if (!node) {
          throw Error("Unreachable");
        }
        node.value = focalLength;
      } else {
        // else add lens
        const node = new Node(focalLength);
        box.list.append(node);
        box.map.set(label, node);
      }
    } else {
      const label = line.slice(0, line.length - 1);
      const hash = getHash(label.split(""));
      const box = boxes[hash];
      if (box.map.has(label)) {
        // remove lens
        const node = box.map.get(label);
        if (!node) {
          throw Error("Unreachable");
        }
        node.detach();
        box.map.delete(label);
      }
    }
  }

  return boxes.reduce((acc, box, boxIdx) => {
    return (
      acc +
      box.list.toArray().reduce((innerAcc, node, nodeIdx) => {
        return innerAcc + (boxIdx + 1) * (nodeIdx + 1) * node.value;
      }, 0)
    );
  }, 0);
};

const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

run({
  part1: {
    tests: [
      {
        input,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
