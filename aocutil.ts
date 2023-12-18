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

/**
 * V2D is a 2D vector.
 */
export interface V2D {
  x: number;
  y: number;
}

/**
 * V2DKey is a string representation of a 2D vector.
 */
export type V2DKey = `${number},${number}`;

/**
 * makeV2DKey makes a V2DKey from a V2D.
 */
export function makeV2DKey(v: V2D): V2DKey {
  return `${v.x},${v.y}`;
}

/**
 * Matrix2D is a 2D matrix.
 */
export type Matrix2D<T> = T[][];
