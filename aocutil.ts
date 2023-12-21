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

/**
 * gcd returns the greatest common divisor of two numbers.
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * pickArea calculates the area of a lattice polygon using Pick's theorem.
 */
export function pickArea(curve: V2D[]): number {
  const interiorPoints = sumInteriorPoints(curve);
  return interiorPoints + curve.length;
}

/**
 * shoelace calculates the area of a lattice polygon using the shoelace formula.
 */
export function shoelace(points: V2D[]): number {
  // Use the shoelace formula to calculate the area of the polygon.
  const n = points.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const current = points[i];
    const next = points[(i + 1) % n];

    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area) * 0.5;
}

/**
 * sumInteriorPoints calculates the number of interior lattice points using Pick's theorem.
 */
export function sumInteriorPoints(points: V2D[]): number {
  const area = shoelace(points);

  // Calculate the number of interior lattice points using Pick's theorem.
  const interiorPoints = area - (points.length * 0.5) + 1;
  return Math.floor(interiorPoints);
}

/**
 * maxBoundsOf calculates the max bounds of a set of points.
 */
export function maxBoundsOf(points: V2D[]): V2D {
  const bounds: V2D = {
    x: Number.NEGATIVE_INFINITY,
    y: Number.NEGATIVE_INFINITY,
  };
  for (const p of points) {
    bounds.x = Math.max(bounds.x, p.x);
    bounds.y = Math.max(bounds.y, p.y);
  }

  return bounds;
}

/**
 * minBoundsOf calculates the min bounds of a set of points.
 */
export function minBoundsOf(points: V2D[]): V2D {
  const bounds: V2D = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
  };
  for (const p of points) {
    bounds.x = Math.min(bounds.x, p.x);
    bounds.y = Math.min(bounds.y, p.y);
  }

  return bounds;
}

/**
 * MinMaxV2D is a pair of min and max V2Ds.
 */
export interface MinMaxV2D {
  min: V2D;
  max: V2D;
  dx: number;
  dy: number;
}

/**
 * boundsOf calculates the bounds of a set of points.
 *
 * TODO: Rename boundsFromPoints, maxBoundsFromPoints, minBoundsFromPoints.
 */
export function boundsOf(points: V2D[]): MinMaxV2D {
  const max = maxBoundsOf(points);
  const min = minBoundsOf(points);
  return {
    min,
    max,
    dx: max.x - min.x,
    dy: max.y - min.y,
  };
}

/**
 * addV2D adds two V2Ds.
 */
export function addV2D(a: V2D, b: V2D): V2D {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

/**
 * mulV2D multiplies a V2D by a scalar.
 */
export function mulV2D(a: V2D, b: number): V2D {
  return {
    x: a.x * b,
    y: a.y * b,
  };
}

/**
 * subV2D subtracts two V2Ds.
 */
export function subV2D(a: V2D, b: V2D): V2D {
  return addV2D(a, mulV2D(b, -1));
}

/**
 * divV2D divides a V2D by a scalar.
 */
export function divV2D(a: V2D, b: number): V2D {
  return mulV2D(a, 1 / b);
}

/**
 * isV2DInBounds checks if a V2D is in bounds.
 */
export function isV2DInBounds(v: V2D, bounds: MinMaxV2D): boolean {
  return v.x >= bounds.min.x && v.x <= bounds.max.x &&
    v.y >= bounds.min.y && v.y <= bounds.max.y;
}

/**
 * v2D makes a V2D from two numbers.
 */
export function v2D(x: number, y: number): V2D {
  return { x, y };
}

const DEFAULT_MIN_V2D = v2D(0, 0);

/**
 * bounds2D makes a MinMaxV2D from two V2Ds.
 */
export function bounds2D(min: V2D, max: V2D): MinMaxV2D;
export function bounds2D(max: V2D): MinMaxV2D;
export function bounds2D(minOrMax: V2D, max?: V2D): MinMaxV2D {
  const theMin = { ...(max === undefined ? DEFAULT_MIN_V2D : minOrMax) };
  const theMax = { ...(max === undefined ? minOrMax : max) };
  return {
    min: theMin,
    max: theMax,
    dx: theMax.x - theMin.x,
    dy: theMax.y - theMin.y,
  };
}

/**
 * v2DKeyToV2D parses a V2DKey into a V2D.
 */
export function v2DKeyToV2D(key: V2DKey): V2D {
  const [x, y] = key.split(",").map((n) => parseInt(n, 10));
  return { x, y };
}
