import { load, parseArgs, Temporal } from "aocutil/deps.ts";

if (import.meta.main) {
  await load({ export: true });
  const est = parseESTFromArgs();
  const puzzleURL = makePuzzleURL(est);
  console.log(`Fetched puzzle input from ${puzzleURL}`);

  const dirname = `./${est.year}/${est.day}`;
  const session = Deno.env.get("AOC_SESSION");
  if (session === undefined) {
    console.error("Missing AOC_SESSION environment variable");
    Deno.exit(1);
  }

  const inputString = await fetchPuzzleInput(puzzleURL, session);
  writePuzzleInput(dirname, inputString);

  const templatePath = `${dirname}/main.ts`;
  copyTemplate(est, templatePath);
  console.log(`Copied template to ${templatePath}`);
}

/**
 * EST represents the year and day of the Advent of Code puzzle.
 */
export interface EST {
  year: string;
  day: string;
}

export function makePuzzleURL(est: EST): string {
  return `https://adventofcode.com/${est.year}/day/${est.day}`;
}

export async function fetchPuzzleInput(
  puzzleURL: string,
  session: string,
): Promise<string> {
  const inputURL = `${puzzleURL}/input`;
  const response = await fetch(
    inputURL,
    {
      headers: { Cookie: `session=${session}` },
    },
  );

  return await response.text();
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

// Define constants.

if (import.meta.main) {
  part1();
  part2();
}

function part1() {
  const input = aocutil.readFile("./${est.year}/${est.day}/input");
  // TODO: Solve part 1.
}

function part2() {
  const input = aocutil.readFile("./${est.year}/${est.day}/input");
  // TODO: Solve part 2.
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
