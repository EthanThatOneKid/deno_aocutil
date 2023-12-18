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

interface ColoredV2D {
  position: aocutil.V2D;
  color: number;
}

function doDigs(digs: Dig[]): ColoredV2D[] {
  if (digs.length === 0) {
    return [];
  }

  function appendEdge(v: aocutil.V2D, color: number): void {
    // Append the edge if it's not already in the perimeter.
    const exists = edges.some((e) =>
      e.position.x === current.x && e.position.y === current.y
    );
    if (!exists) {
      edges.push({ position: { ...v }, color });
    }
  }

  function doDig(dig: Dig) {
    // Apply the dig.
    switch (dig.type) {
      case DigType.U:
      case DigType.D: {
        const vy = dig.type === DigType.U ? -1 : 1;
        for (let i = 0; i < dig.length; i++) {
          current.y += vy;
          appendEdge(current, dig.color);
        }

        break;
      }

      case DigType.R:
      case DigType.L: {
        const vx = dig.type === DigType.R ? 1 : -1;
        for (let i = 0; i < dig.length; i++) {
          current.x += vx;
          appendEdge(current, dig.color);
        }

        break;
      }
    }
  }

  const current: aocutil.V2D = { x: 0, y: 0 };
  const edges: ColoredV2D[] = [{
    position: { ...current },
    color: digs[0].color,
  }];
  for (const dig of digs) {
    doDig(dig);
  }

  return edges;
}

function renderPoints(points: ColoredV2D[]): string {
  const bounds = aocutil.boundsOf(points.map((e) => e.position));
  const result = Array.from(
    { length: bounds.dy + 1 },
    () => " ".repeat(bounds.dx + 1).split(""),
  );
  const offsetX = -bounds.min.x;
  const offsetY = -bounds.min.y;
  for (const edge of points) {
    try {
      const x = edge.position.x + offsetX;
      const y = edge.position.y + offsetY;
      result[y][x] = rgb24("#", edge.color);
    } catch (error) {
      console.log(edge);
      throw error;
    }
  }

  return result.map((row) => row.join("")).join("\n");
}

function sumCubicMeters(digs: Dig[]): number {
  const edges = doDigs(digs);
  console.log(renderPoints(edges));

  // Sum the cubic meters.
  const points = edges.map((e) => e.position);
  return aocutil.pickArea(points);
}

export function sumCubicMetersFromInput(input: string): number {
  const digs = parseDigsFromInput(input);
  return sumCubicMeters(digs);
}
