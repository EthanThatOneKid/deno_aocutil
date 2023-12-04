/**
 * readFileString reads a file into a string, panicking if it fails.
 */
export function readFile(name: string): string {
  return Deno.readTextFileSync(name);
}

/**
 * splitFile splits a file into lines.
 */
export function splitFile(name: string, split: string): string[] {
  const f = readFile(name);
  return f.split(split);
}

/**
 * splitFileLines splits a file into lines.
 */
export function splitFileLines(name: string): string[] {
  return splitFile(name, "\n").map((line) => line.trim());
}
