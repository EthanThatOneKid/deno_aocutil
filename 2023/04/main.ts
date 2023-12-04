import * as aocutil from "aocutil/aocutil.ts";

interface Scratchcard {
  id: number;
  numbers: number[];
  winningNumbers: number[];

  /** points used in part 1. */
  points: number;

  /** matches used in part 2. */
  matches: number;
}

function parseScratchcard(line: string): Scratchcard | undefined {
  const [id, allNumbers] = line.split(":");
  if (!id || !allNumbers) {
    return;
  }

  const [numbers, winningNumbers] = allNumbers.split("|");
  const theNumbers = numbers.split(" ").map(Number).filter((n) => n !== 0);
  const theWinningNumbers = winningNumbers
    .split(" ")
    .map(Number)
    .filter((n) => n !== 0);
  return {
    id: Number(id.match(/\d+/)![0]),
    numbers: theNumbers,
    winningNumbers: theWinningNumbers,
    matches: scratchcardMatches(theNumbers, theWinningNumbers),
    points: scratchcardPoints(theNumbers, theWinningNumbers),
  };
}

function scratchcardMatches(
  numbers: number[],
  winningNumbers: number[],
): number {
  return numbers.reduce((matches: number, number: number) => {
    if (winningNumbers.includes(number)) {
      matches++;
    }

    return matches;
  }, 0);
}

function scratchcardPoints(
  numbers: number[],
  winningNumbers: number[],
): number {
  return numbers.reduce((value: number, number: number) => {
    if (winningNumbers.includes(number)) {
      if (value === 0) {
        return 1;
      } else {
        return value * 2;
      }
    }
    return value;
  }, 0);
}

if (import.meta.main) {
  performance.mark("part1");
  part1();
  performance.mark("part2");
  part2();
  performance.mark("end");

  const part1Measure = performance.measure("part1", "part1", "part2");
  const part2Measure = performance.measure("part2", "part2", "end");
  console.table({
    "Part 1": { "time (ms)": part1Measure.duration },
    "Part 2": { "time (ms)": part2Measure.duration },
  });
  // ┌────────┬───────────────────┐
  // │ (idx)  │ time (ms)         │
  // ├────────┼───────────────────┤
  // │ Part 1 │ 4.035599999999995 │
  // │ Part 2 │ 6612.636399999999 │
  // └────────┴───────────────────┘
  //
}

function part1() {
  const lines = aocutil.splitFileLines("./2023/04/input");
  const cards = lines.map(parseScratchcard).filter((card) =>
    card !== undefined
  ) as Scratchcard[];
  const allPoints = cards.map((card) => card.points);
  const sum = allPoints.reduce((sum, value) => sum + value, 0);
  console.log(sum);
}

function part2() {
  const lines = aocutil.splitFileLines("./2023/04/input");
  const cards = lines.map(parseScratchcard).filter((card) =>
    card !== undefined
  ) as Scratchcard[];
  let i;
  for (i = 0; i < cards.length; i++) {
    const card = cards[i];
    const index = cards.findIndex((c) => c.id === card.id);
    const copies = cards.slice(
      index + 1,
      index + 1 + card.matches,
    );
    cards.push(...copies);
    // debug(cards);
  }

  console.log(i);
}

function debug(cards: Scratchcard[]) {
  console.log({ length: cards.length });
  console.table({
    cards: cards.reduce((ids, card) => {
      if (card.id in ids) {
        ids[card.id]++;
      } else {
        ids[card.id] = 1;
      }
      return ids;
    }, {} as Record<number, number>),
  });
}
