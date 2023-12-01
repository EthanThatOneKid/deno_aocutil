// TODO: Move to deps.ts
import { parseArgs } from "https://deno.land/std@0.208.0/cli/mod.ts";

export function makePuzzleURL(year: string, day: string): string {
  return `https://adventofcode.com/${year}/day/${day}`;
}

export function fetchPuzzleInput(puzzleURL: string): Promise<string> {
  const inputURL = `${puzzleURL}/input`;
  return fetch(inputURL).then((r) => r.text());
}

export function writePuzzle(dirname: string, input: string): void {
  Deno.mkdirSync(dirname, { recursive: true });

  const filename = `${dirname}/input`;
  Deno.writeTextFileSync(filename, input);
}

export function copyTemplate(to: string): void {
  const template = Deno.readTextFileSync("./cmd/new/template.ts");
  Deno.writeTextFileSync(to, template);
}

// interface EST {
// year: number;
// day: number;
// }

// export function getEST(): EST {
// TODO: Get the EST from the puzzle page.
// }

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
  const inputString = await fetchPuzzleInput(puzzleURL);
  writePuzzle(dirname, inputString);

  const templatePath = `${dirname}/main.ts`;
  console.log(`Copying template to ${templatePath}`);
  copyTemplate(templatePath);

  console.log("Done!");
}
