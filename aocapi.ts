/**
 * EST represents the year and day of the Advent of Code puzzle.
 */
export interface EST {
  year: string;
  day: string;
}

/**
 * makePuzzleURL makes the puzzle URL for the Advent of Code website.
 */
export function makePuzzleURL(est: EST): string {
  return `https://adventofcode.com/${est.year}/day/${est.day}`;
}

/**
 * fetchPuzzleInput fetches the puzzle input from the Advent of Code website.
 */
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
/**
 * submit submits a solution to the Advent of Code website.
 */
export async function submit<T>(
  est: EST,
  part: number,
  solution: T,
): Promise<boolean> {
  const session = Deno.env.get("AOC_SESSION");
  if (session === undefined) {
    console.error("Missing AOC_SESSION environment variable");
    Deno.exit(1);
  }

  const puzzleURL = makePuzzleURL(est);
  const request = await fetch(
    `${puzzleURL}/answer`,
    {
      method: "POST",
      headers: {
        Cookie: `session=${session}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        level: String(part),
        answer: String(solution),
      }),
    },
  );
  const html = await request.text();
  const mainHTMLMatch = /<main\b[^>]*>(.*)<\/main>/s.exec(html);
  if (!mainHTMLMatch) {
    console.error("Failed to parse main HTML", html);
    Deno.exit(1);
  }

  const mainHTML = mainHTMLMatch[1];
  if (mainHTML.includes("That's the right answer!")) {
    return true;
  }

  if (mainHTML.includes("That's not the right answer")) {
    return false;
  }

  console.error("Something went wrong", mainHTML);
  Deno.exit(1);
}
