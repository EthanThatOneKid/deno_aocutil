// TODO: Move to deps.ts
import { parseArgs } from "https://deno.land/std@0.208.0/cli/mod.ts";
import { Temporal } from "npm:@js-temporal/polyfill@0.4.4";

export function makePuzzleURL(year: string, day: string): string {
  return `https://adventofcode.com/${year}/day/${day}`;
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

export function copyTemplate(year: string, day: string, to: string): void {
  const template = `import * as aocutil from "aocutil/aocutil.ts";

if (import.meta.main) {
  const input = aocutil.readFile("./${year}/${day}/input");

  // TODO: Solve the puzzle.
}`;
  Deno.writeTextFileSync(to, template);
}

export interface EST {
  year: number;
  day: number;
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
    year: plainDateTime.year,
    day: plainDateTime.day,
  };
}

export interface EST {
  year: number;
  day: number;
}

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["year", "day"],
    alias: {
      year: "y",
      day: "d",
    },
  });
  if (flags.year === undefined) {
    console.error("Missing year");
    Deno.exit(1);
  }

  if (flags.day === undefined) {
    console.error("Missing day");
    Deno.exit(1);
  }

  const puzzleURL = makePuzzleURL(flags.year, flags.day);
  console.log(`Fetching puzzle input from ${puzzleURL}`);

  const dirname = `./${flags.year}/${flags.day}`;
  const session = Deno.env.get("AOC_SESSION");
  if (session === undefined) {
    console.error("Missing AOC_SESSION environment variable");
    Deno.exit(1);
  }

  const inputString = await fetchPuzzleInput(puzzleURL, session);
  writePuzzleInput(dirname, inputString);

  const templatePath = `${dirname}/main.ts`;
  copyTemplate(flags.year, flags.day, templatePath);
  console.log(`Copied template to ${templatePath}`);
}
