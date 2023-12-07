import * as aocutil from "aocutil/aocutil.ts";

// Define constants.
const HAND_TYPES = [
  "High card",
  "One pair",
  "Two pair",
  "Three of a kind",
  "Full house",
  "Four of a kind",
  "Five of a kind",
] as const;

type HandType = typeof HAND_TYPES[number];

if (import.meta.main) {
  performance.mark("part1");
  const part1Solution = await part1();

  performance.mark("part2");
  const part2Solution = await part2();

  performance.mark("end");
  const part1Measure = performance.measure("part1", "part1", "part2");
  const part2Measure = performance.measure("part2", "part2", "end");
  console.table({
    "Part 1": { solution: part1Solution, "time (ms)": part1Measure.duration },
    "Part 2": { solution: part2Solution, "time (ms)": part2Measure.duration },
  });
}

function part1() {
  const input = aocutil.readFile("./2023/07/input");
  const hands = input.split("\n").filter((l) => l.trim().length > 0).map((l) =>
    parseHand(l.trim())
  );
  const ranks = getRanks(hands);
  const totalWinnings = ranks.reduce((acc, r) => acc + r.bid * r.rank, 0);
  return totalWinnings;
}

// TODO: Fix bug in part 2. Returns an incorrect solution.
function part2() {
  const input = aocutil.readFile("./2023/07/sample_input");
  const hands = input.split("\n").filter((l) => l.trim().length > 0).map((l) =>
    parseHand(l.trim())
  );
  const ranks = getRanks(hands, true);
  const totalWinnings = ranks.reduce((acc, r) => acc + r.bid * r.rank, 0);
  return totalWinnings;
}

/**
 * compareHands returns true if h1 beats h2.
 */
function compareHands(
  h1: string,
  h2: string,
  p2 = false,
  recurseMode = false,
): boolean {
  if (p2) {
    const optimalHands1 = optimalHands(h1, "J");
    const optimalHands2 = optimalHands(h2, "J");

    // Is there a hand in optimalHands1 that beats all hands in optimalHands2?
    for (const oh1 of optimalHands1) {
      if (
        optimalHands2.every((h) =>
          h === oh1 || compareHands(oh1, h, false, true)
        )
      ) {
        return true;
      }
    }

    // Is there a hand in optimalHands2 that beats all hands in optimalHands1?
    for (const oh2 of optimalHands2) {
      if (
        optimalHands1.every((h) =>
          h === oh2 || compareHands(h, oh2, false, true)
        )
      ) {
        return false;
      }
    }
  }

  const h1TypeValue = handTypeValue(handType(h1));
  const h2TypeValue = handTypeValue(handType(h2));
  if (h1TypeValue > h2TypeValue) {
    return true;
  }

  if (h1TypeValue < h2TypeValue) {
    return false;
  }

  let i = 0;
  while (i < h1.length) {
    const h1CardValue = cardValue(h1[i], p2 || recurseMode);
    const h2CardValue = cardValue(h2[i], p2 || recurseMode);
    if (h1CardValue > h2CardValue) {
      return true;
    } else if (h1CardValue < h2CardValue) {
      return false;
    }

    i++;
  }

  throw new Error("Hands are equal");
}

interface Hand {
  cards: string;
  bid: number;
}

function parseHand(hand: string): Hand {
  const [cards, bid] = hand.split(" ");
  return { cards, bid: Number(bid) };
}

interface Rank {
  bid: number;
  rank: number;
}

function getRanks(hands: Hand[], p2 = false): Rank[] {
  return hands
    .sort((h1, h2) => compareHands(h1.cards, h2.cards, p2) ? 1 : -1)
    .map((h, i) => ({ bid: h.bid, rank: i + 1 }));
}

function handType(cards: string): HandType {
  const frequencies = cardFrequencies(cards);
  if (frequencies.size === 1) {
    return "Five of a kind";
  }

  if (frequencies.size === 2) {
    const [first, second] = frequencies.values();
    if (first === 3 || second === 3) {
      return "Full house";
    }

    return "Four of a kind";
  }

  if (frequencies.size === 3) {
    const [first, second, third] = frequencies.values();
    if (first === 3 || second === 3 || third === 3) {
      return "Three of a kind";
    }

    return "Two pair";
  }

  if (frequencies.size === 4) {
    return "One pair";
  }

  return "High card";
}

function handTypeValue(handType: HandType): number {
  return HAND_TYPES.indexOf(handType);
}

function cardFrequencies(cards: string): Map<string, number> {
  const frequencies = new Map<string, number>();
  for (const card of cards) {
    const frequency = frequencies.get(card) || 0;
    frequencies.set(card, frequency + 1);
  }

  return frequencies;
}

function cardValue(card: string, p2 = false) {
  switch (card) {
    case "A": {
      return 14;
    }

    case "K": {
      return 13;
    }

    case "Q": {
      return 12;
    }

    case "J": {
      return p2 ? 1 : 11;
    }

    case "T": {
      return 10;
    }

    default: {
      return Number(card);
    }
  }
}

// Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.
function optimalHands(cards: string, card: string): string[] {
  let recordHandValue = handTypeValue(handType(cards));

  const hands: string[] = [];
  function recurse(cards: string, i: number) {
    if (i >= cards.length) {
      const value = handTypeValue(handType(cards));
      if (value > recordHandValue) {
        recordHandValue = value;
        if (hands.length > 0 && handTypeValue(handType(hands[0])) < value) {
          hands.length = 0;
        }

        hands.push(cards);
      }

      return;
    }

    if (cards[i] === card) {
      for (const c of "AKQJT98765432") {
        recurse(cards.slice(0, i) + c + cards.slice(i + 1), i + 1);
      }
    } else {
      recurse(cards, i + 1);
    }
  }

  recurse(cards, 0);
  return hands;
}
