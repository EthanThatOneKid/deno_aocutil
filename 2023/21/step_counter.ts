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
  console.log(renderGarden(g, spaces));
  for (let i = 0; i < steps; i++) {
    advanceSpaces(g, spaces);
  }

  console.log(renderGarden(g, spaces));
  return spaces.size;
}

export function sumPossibleSpacesFromInput(input: string): number {
  const g = parseGarden(input);
  return sumPossibleSpaces(g, 64);
}

function renderGarden(g: Garden, spaces: Set<aocutil.V2DKey>): string {
  return g.matrix
    .map((row, i) => {
      let result = "";
      for (let j = 0; j < row.length; j++) {
        const key = aocutil.makeV2DKey({ x: j, y: i });
        result += spaces.has(key) ? "O" : row[j];
      }

      return result;
    })
    .join("\n");
}
