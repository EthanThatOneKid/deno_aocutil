import { rgb24 } from "https://deno.land/std@0.209.0/fmt/colors.ts";
import * as aocutil from "aocutil/aocutil.ts";

enum DigType {
  /**
   * U is up.
   */
  U = "U",

  /**
   * R is right.
   */
  R = "R",

  /**
   * D is down.
   */
  D = "D",

  /**
   * L is left.
   */
  L = "L",
}

function isDigType(value: unknown): value is DigType {
  switch (value as unknown as DigType) {
    case DigType.U:
    case DigType.R:
    case DigType.D:
    case DigType.L: {
      return true;
    }

    default: {
      return false;
    }
  }
}

interface Dig {
  type: DigType;
  length: number;
  color: number;
}

const DIG_PATTERN = /^([URDL])\s(\d+)\s\(\#([a-zA-Z0-9]+)\)?/;

function parseDig(line: string): Dig {
  const match = line.match(DIG_PATTERN);
  if (!match) {
    throw new Error(`Invalid dig: ${line}`);
  }

  const type = match[1];
  if (!isDigType(type)) {
    throw new Error(`Invalid dig type: ${type}`);
  }

  const length = parseInt(match[2]);
  if (isNaN(length)) {
    throw new Error(`Invalid dig length: ${length}`);
  }

  const color = parseInt(match[3], 16);
  if (isNaN(color)) {
    throw new Error(`Invalid dig color: ${color}`);
  }

  return { type, length, color };
}

function parseDigs(lines: string[]): Dig[] {
  return lines.map((l) => parseDig(l));
}

function parseDigsFromInput(input: string): Dig[] {
  const lines = input
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return parseDigs(lines);
}

function within(
  v: aocutil.V2D,
  bound: aocutil.V2D,
  area: Set<aocutil.V2DKey>,
): boolean {
  const minX = Math.min(v.x, bound.x - v.x);
  const minY = Math.min(v.y, bound.y - v.y);
  let foundU = false;
  let foundR = false;
  let foundD = false;
  let foundL = false;
  for (let x = 0; x < minX; x++) {
    for (let y = 0; y < minY; y++) {
      if (area.has(aocutil.makeV2DKey({ x, y }))) {
        foundU = true;
      }

      if (area.has(aocutil.makeV2DKey({ x: -x, y }))) {
        foundD = true;
      }

      if (area.has(aocutil.makeV2DKey({ x, y: -y }))) {
        foundR = true;
      }

      if (area.has(aocutil.makeV2DKey({ x: -x, y: -y }))) {
        foundL = true;
      }

      if (foundU && foundR && foundD && foundL) {
        return true;
      }
    }
  }

  return false;
}

interface DigsResult {
  bound: aocutil.V2D;
  perimeter: Set<aocutil.V2DKey>;
}

function doDigs(
  fn: (c: aocutil.V2D, d: Dig) => void,
  digs: Dig[],
): DigsResult {
  const perimeter = new Set<aocutil.V2DKey>();
  const current: aocutil.V2D = { x: 0, y: 0 };
  const bound: aocutil.V2D = { x: 0, y: 0 };
  perimeter.add(aocutil.makeV2DKey(current));

  function doDig(dig: Dig) {
    // Apply the dig.
    switch (dig.type) {
      case DigType.U:
      case DigType.D: {
        const vy = dig.type === DigType.U ? 1 : -1;
        for (let i = 0; i < dig.length; i++) {
          current.y += vy;
          perimeter.add(aocutil.makeV2DKey(current));

          // Update the bound.
          if (current.y < bound.y) {
            bound.y = current.y;
          }

          // Call the callback.
          fn(current, dig);
        }

        break;
      }

      case DigType.R:
      case DigType.L: {
        const vx = dig.type === DigType.R ? 1 : -1;
        for (let i = 0; i < dig.length; i++) {
          current.x += vx;
          perimeter.add(aocutil.makeV2DKey(current));

          // Update the bound.
          if (current.x < bound.x) {
            bound.x = current.x;
          }

          // Call the callback.
          fn(current, dig);
        }

        break;
      }
    }
  }

  for (const dig of digs) {
    doDig(dig);
  }

  return { bound, perimeter };
}

function sumCubicMeters(digs: Dig[]): number {
  const digsResult = doDigs();

  // Sum the cubic meters by checking each point in the bound.
}

export function sumCubicMetersFromInput(input: string): number {
  const digs = parseDigsFromInput(input);
  return sumCubicMeters(digs);
}
