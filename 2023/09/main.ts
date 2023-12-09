import * as aocutil from "aocutil/aocutil.ts";
import * as aocapi from "aocutil/aocapi.ts";

// Define constants.

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

  await aocapi.submitPart1({ year: "2023", day: "9" }, part1Solution);
  // await aocapi.submitPart2({ year: "2023", day: "9" }, part2Solution);
}

function part1() {
  const input = aocutil.readFile("./2023/09/sample_input");
  const histories = oasis(input);
  const extrapolations = histories.map((history) => extrapolate(history));
  return extrapolations.reduce((sum, value) => sum + value, 0);
}

function part2() {
}

type History = number[];

type Histories = History[];

/**
 * oasis is the Oasis And Sand Instability Sensor. The OASIS produces a report
 * of many values and how they are changing over time.
 */
function oasis(input: string): Histories {
  return input
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      return line
        .trim()
        .split(" ")
        .map((value) => {
          const int = parseInt(value.trim());
          if (Number.isNaN(int)) {
            console.log({ line, value });
            throw new Error(`Not a number: ${value}`);
          }

          return int;
        });
    });
}

function extrapolate(history: History): number {
  if (history.length === 0) {
    return 0;
  }

  // significancies are the numbers to be used in extrapolation.
  const significancies: number[] = [history[history.length - 1]];
  let differences: History = [...history];
  // console.log({ differences , significancies });
  while (!allZero(differences)) {
    differences = differencesOf(differences);
    significancies.push(differences[differences.length - 1]);
  }

  const extrapolation = significancies.reduce((sum, value) => sum + value, 0);
  if (Number.isNaN(extrapolation)) {
    console.log({ history, significancies, differences });
    throw new Error("Extrapolation is NaN");
  }

  return extrapolation;
}

function differencesOf(history: History): History {
  const next: History = [];
  for (let i = 0; i < history.length - 1; i++) {
    next.push(history[i + 1] - history[i]);
  }

  return next;
}

function allZero(history: History): boolean {
  return history.every((value) => value === 0);
}
