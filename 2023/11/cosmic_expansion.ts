const GALAXY_CHARACTER = "#";

export interface Position {
  x: number;
  y: number;
}

export type Galaxy = Position;

export interface Cosmos {
  galaxies: Galaxy[];
  bounds: Position;
}

export function parseCosmos(input: string): Cosmos {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length !== 0);

  const galaxies: Galaxy[] = [];
  let xBoundary = 0;
  let yBoundary = 0;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    if (line.length > xBoundary) {
      xBoundary = line.length;
    }

    for (let x = 0; x < line.length; x++) {
      const c = line[x];
      if (y > yBoundary) {
        yBoundary = y;
      }

      if (c === GALAXY_CHARACTER) {
        galaxies.push({ x, y });
      }
    }
  }

  return {
    galaxies,
    bounds: { x: xBoundary, y: yBoundary },
  };
}

export type RowOrColumn =
  | { y: number }
  | { x: number };

export function findEmptyRowsAndColumns(cosmos: Cosmos): RowOrColumn[] {
  const empty: RowOrColumn[] = [];

  // Test rows.
  for (let y = 0; y < cosmos.bounds.y; y++) {
    const row = cosmos.galaxies.filter((g) => g.y === y);
    if (row.length === 0) {
      empty.push({ y });
    }
  }

  // Test columns.
  for (let x = 0; x < cosmos.bounds.x; x++) {
    const column = cosmos.galaxies.filter((g) => g.x === x);
    if (column.length === 0) {
      empty.push({ x });
    }
  }

  return empty;
}

export function expandCosmos(cosmos: Cosmos, rate = 1): Cosmos {
  const emptyRowsAndColumns = findEmptyRowsAndColumns(cosmos);
  const newGalaxies: Galaxy[] = [...cosmos.galaxies.map((g) => ({ ...g }))];
  let xBoundary = cosmos.bounds.x;
  let yBoundary = cosmos.bounds.y;
  for (const rowOrColumn of emptyRowsAndColumns) {
    if ("y" in rowOrColumn) {
      yBoundary += rate;
      for (let i = 0; i < newGalaxies.length; i++) {
        if (cosmos.galaxies[i].y > rowOrColumn.y) {
          newGalaxies[i].y += rate;
        }
      }

      continue;
    }

    if ("x" in rowOrColumn) {
      xBoundary += rate;
      for (let i = 0; i < newGalaxies.length; i++) {
        if (cosmos.galaxies[i].x > rowOrColumn.x) {
          newGalaxies[i].x += rate;
        }
      }

      continue;
    }

    throw new Error("Invalid row or column.");
  }

  return {
    galaxies: newGalaxies,
    bounds: { x: xBoundary, y: yBoundary },
  };
}

export function walkPairs<T>(data: T[], fn: (a: T, b: T) => void) {
  for (let i = 0; i < data.length - 1; i++) {
    for (let j = i + 1; j < data.length; j++) {
      fn(data[i], data[j]);
    }
  }
}

export function between(g1: Position, g2: Position): number {
  return Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y);
}

export function sumExpandedGalaxyPairDistances(
  input: string,
  rate = 1,
): number {
  const cosmos = parseCosmos(input);
  const expanded = expandCosmos(cosmos, rate);
  let sum = 0;
  walkPairs(
    expanded.galaxies,
    (a, b) => {
      sum += between(a, b);
    },
  );

  return sum;
}
