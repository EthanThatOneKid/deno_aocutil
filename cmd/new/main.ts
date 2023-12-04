import { load, parseArgs, Temporal } from "aocutil/deps.ts";
import type { EST } from "aocutil/aocapi.ts";
import { fetchPuzzleInput, makePuzzleURL } from "aocutil/aocapi.ts";

if (import.meta.main) {
  await load({ export: true });
  const est = parseESTFromArgs();
  const puzzleURL = makePuzzleURL(est);
  console.log(`Fetched puzzle input from ${puzzleURL}`);

  const dirname = `./${est.year}/${est.day.padStart(2, "0")}`;
  const session = Deno.env.get("AOC_SESSION");
  if (session === undefined) {
    console.error("Missing AOC_SESSION environment variable");
    Deno.exit(1);
  }

  const inputString = await fetchPuzzleInput(puzzleURL, session);
  writePuzzleInput(dirname, inputString);

  const templatePath = `${dirname}/main.ts`;
  copyTemplate(est, templatePath);
  console.log(`Start solving ${puzzleURL} in ${templatePath}`);
}

export function writePuzzleInput(dirname: string, input: string): void {
  Deno.mkdirSync(dirname, { recursive: true });
  Deno.writeTextFileSync(`${dirname}/input`, input);
  Deno.writeTextFileSync(`${dirname}/sample_input`, "");
}

export function parseESTFromArgs(): EST {
  const est = getEST();
  return parseArgs(Deno.args, {
    string: ["year", "day"],
    alias: { year: "y", day: "d" },
    default: { year: est.year, day: est.day },
  });
}

export function copyTemplate(est: EST, to: string): void {
  const template = `import * as aocutil from "aocutil/aocutil.ts";
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

  // await aocapi.submitPart1({ year: "${est.year}", day: "${est.day}" }, part1Solution);
  // await aocapi.submitPart2({ year: "${est.year}", day: "${est.day}" }, part2Solution);
}

function part1() {
  const input = aocutil.readFile("./${est.year}/${
    est.day.padStart(2, "0")
  }/input");
}

function part2() {
}
`;
  Deno.writeTextFileSync(to, template);
}

/**
 * getEST returns the current EST year and day.
 */
export function getEST(): EST {
  const timeZone = Temporal.TimeZone.from("America/New_York");
  if (!timeZone.getPlainDateTimeFor) {
    throw new Error("Could not get time zone");
  }

  const now = Temporal.Now.instant();
  const plainDateTime = timeZone.getPlainDateTimeFor(now);
  return {
    year: plainDateTime.year.toString(),
    day: plainDateTime.day.toString(),
  };
}
