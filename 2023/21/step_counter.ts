import * as aocutil from "aocutil/aocutil.ts";

enum SpaceType {
  ROCK = "#",
  PLOT = ".",
}

interface Garden {
  start: aocutil.V2D;
  bounds: aocutil.V2D;
  matrix: aocutil.Matrix2D<SpaceType>;
}

function parseGarden(input: string): Garden {
  let start: aocutil.V2D = { x: 0, y: 0 };
  const bounds: aocutil.V2D = { x: 0, y: 0 };
  const matrix = input.split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, i) => {
      if (i > bounds.y) {
        bounds.y = i;
      }

      return line.split("")
        .map((space, j) => {
          if (j > bounds.x) {
            bounds.x = j;
          }

          switch (space) {
            case SpaceType.ROCK:
            case SpaceType.PLOT: {
              return space;
            }

            case "S": {
              start = { x: j, y: i };
              return SpaceType.PLOT;
            }

            default: {
              throw new Error(`Invalid space type: ${space}`);
            }
          }
        });
    });

  return { start, bounds, matrix };
}

const STEP_VELOCITIES = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

function isInBounds(space: aocutil.V2D, bounds: aocutil.V2D): boolean {
  return aocutil.isV2DInBounds(space, aocutil.bounds2D(bounds));
}

function advanceSpace(g: Garden, space: aocutil.V2D): aocutil.V2D[] {
  const spaces: aocutil.V2D[] = [];
  for (const velocity of STEP_VELOCITIES) {
    const nextSpace = aocutil.addV2D(space, velocity);
    if (
      !isInBounds(nextSpace, g.bounds) ||
      g.matrix[nextSpace.y][nextSpace.x] !== SpaceType.PLOT
    ) {
      continue;
    }

    spaces.push(nextSpace);
  }

  return spaces;
}

function advanceSpaces(g: Garden, spaces: Set<aocutil.V2DKey>): void {
  for (const key of [...spaces.values()]) {
    const space = aocutil.v2DKeyToV2D(key);
    const nextSpaces = advanceSpace(g, space);
    nextSpaces.forEach((s) => spaces.add(aocutil.makeV2DKey(s)));
    spaces.delete(key);
  }
}

function sumPossibleSpaces(g: Garden, steps: number): number {
  const spaces = new Set<aocutil.V2DKey>([aocutil.makeV2DKey(g.start)]);
  for (let i = 0; i < steps; i++) {
    advanceSpaces(g, spaces);
  }

  console.log(renderGarden(g, spaces)); // TODO: remove
  return spaces.size;
}

export function sumPossibleSpacesFromInput(input: string): number {
  const g = parseGarden(input);
  return sumPossibleSpaces(g, 64);
}

function renderGarden(
  g: Garden,
  spaces: Set<aocutil.V2DKey>,
  offset: aocutil.V2D = { x: 0, y: 0 },
): string {
  const rows: string[] = [];
  for (let i = 0; i < g.matrix.length; i++) {
    const matrixY = modulo(i + offset.y, g.bounds.y + 1);
    let row = "";
    for (let j = 0; j < g.matrix[i].length; j++) {
      const matrixX = modulo(j + offset.x, g.bounds.x + 1);
      const key = aocutil.makeV2DKey({ x: j + offset.x, y: i + offset.y });
      const space = spaces.has(key) ? "O" : g.matrix[matrixY][matrixX];
      row += space;
    }

    rows.push(row);
  }

  return rows.join("\n");
}

function modulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function moduloV2D(v: aocutil.V2D, bounds: aocutil.V2D): aocutil.V2D {
  return {
    x: modulo(v.x, bounds.x + 1),
    y: modulo(v.y, bounds.y + 1),
  };
}

function advanceInfiniteSpace(g: Garden, space: aocutil.V2D): aocutil.V2D[] {
  const spaces: aocutil.V2D[] = [];
  for (const velocity of STEP_VELOCITIES) {
    const nextSpace = aocutil.addV2D(space, velocity);
    const nextSpaceMod = moduloV2D(nextSpace, g.bounds);
    if (g.matrix[nextSpaceMod.y][nextSpaceMod.x] !== SpaceType.PLOT) {
      continue;
    }

    spaces.push(nextSpace);
  }

  return spaces;
}

function advanceInfiniteSpaces(g: Garden, spaces: Set<aocutil.V2DKey>): void {
  for (const key of [...spaces.values()]) {
    const space = aocutil.v2DKeyToV2D(key);
    const nextSpaces = advanceInfiniteSpace(g, space);
    nextSpaces.forEach((s) => spaces.add(aocutil.makeV2DKey(s)));
    spaces.delete(key);
  }
}

function findGardensAwayFromStart(g: Garden, steps: number): number {
  const sideLength = g.bounds.x + 0;
  return Math.floor(steps / sideLength);
}

function findMinUnstableGardens(g: Garden, steps: number): aocutil.V2D[] {
  const offset = findGardensAwayFromStart(g, steps);
  return STEP_VELOCITIES.map((v) => aocutil.mulV2D(v, offset));
}

function sumPossibleInfiniteSpaces(g: Garden, steps: number): number {
  const spaces = new Set<aocutil.V2DKey>([aocutil.makeV2DKey(g.start)]);
  //   console.log(renderGarden(g, spaces));
  for (let i = 0; i < steps; i++) {
    advanceInfiniteSpaces(g, spaces);
  }

  //   console.log(renderGarden(g, spaces)); // TODO: remove
  console.log(renderGarden(g, spaces, { x: 0, y: -130 })); // TODO: remove
  //   console.log(renderGarden(g, spaces, { x: -130, y: -130 })); // TODO: remove
  console.log(findMinUnstableGardens(g, steps)); // TODO: remove
  return spaces.size;
}

export function sumPossibleInfiniteSpacesFromInput(input: string): number {
  const g = parseGarden(input);
  //   return sumPossibleInfiniteSpaces(g, 130);
  //   return sumPossibleInfiniteSpaces(g, 155);
  return sumPossibleInfiniteSpaces(g, 260); // 130 * 3
}
