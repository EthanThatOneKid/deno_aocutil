enum SpaceType {
  EMPTY = ".",
  ROUNDED = "O",
  CUBE = "#",
}

type SpaceRow = SpaceType[];
type SpaceMatrix = SpaceRow[];

function parseSpaceMatrix(input: string): SpaceMatrix {
  return input.split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const chars = line.trim().split("");
      return chars.map((char) => {
        switch (char) {
          case SpaceType.EMPTY:
          case SpaceType.CUBE:
          case SpaceType.ROUNDED: {
            return char;
          }

          default: {
            throw new Error(`Unknown space type: ''`);
          }
        }
      });
    });
}

enum TiltType {
  NORTH,
  EAST,
  SOUTH,
  WEST,
}

function copyMatrix(matrix: SpaceMatrix): SpaceMatrix {
  return matrix.map((row) => [...row]);
}

function tiltNorth(matrix: SpaceMatrix): SpaceMatrix {
  const newMatrix = copyMatrix(matrix);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (newMatrix[i][j] !== SpaceType.ROUNDED) {
        continue;
      }

      let di = 1;
      while (di <= i) {
        const above = newMatrix[i - di][j];
        if (above === SpaceType.CUBE || above === SpaceType.ROUNDED) {
          break;
        }

        di++;
      }

      if (di > 1) {
        newMatrix[i - di + 1][j] = newMatrix[i][j];
        newMatrix[i][j] = SpaceType.EMPTY;
      }
    }
  }

  return newMatrix;
}

function tiltEast(matrix: SpaceMatrix): SpaceMatrix {
  const transposedNorth = rotateCounterclockwise(matrix);
  const tiltedNorth = tiltNorth(transposedNorth);
  const transposedEast = rotateCounterclockwise(tiltedNorth, 3);
  return transposedEast;
}

function tiltSouth(matrix: SpaceMatrix): SpaceMatrix {
  const transposedNorth = rotateCounterclockwise(matrix, 2);
  const tiltedNorth = tiltNorth(transposedNorth);
  const transposedSouth = rotateCounterclockwise(tiltedNorth, 2);
  return transposedSouth;
}

function tiltWest(matrix: SpaceMatrix): SpaceMatrix {
  const transposedNorth = rotateCounterclockwise(matrix, 3);
  const tiltedNorth = tiltNorth(transposedNorth);
  const transposedWest = rotateCounterclockwise(tiltedNorth);
  return transposedWest;
}

function sumTotalLoad(matrix: SpaceMatrix): number {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === SpaceType.ROUNDED) {
        sum += matrix.length - i;
      }
    }
  }

  return sum;
}

export function sumTotalLoadFromInput(input: string): number {
  const matrix = parseSpaceMatrix(input);
  const tiltedMatrix = tiltNorth(matrix);
  return sumTotalLoad(tiltedMatrix);
}

const CYCLE = [
  TiltType.NORTH,
  TiltType.WEST,
  TiltType.SOUTH,
  TiltType.EAST,
] as const;

function rotateCounterclockwise(matrix: SpaceMatrix, i = 1): SpaceMatrix {
  if (i <= 0) {
    return copyMatrix(matrix);
  }

  const rotatedMatrix = transposeMatrix(matrix);
  return rotateCounterclockwise(rotatedMatrix, i - 1);
}

function transposeMatrix<T>(matrix: T[][]): T[][] {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const transposedMatrix = Array.from(
    { length: columns },
    () => Array.from({ length: rows }, () => undefined as T),
  );
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const transposedRow = columns - 1 - j;
      const transposedColumn = i;

      transposedMatrix[transposedRow][transposedColumn] = matrix[i][j];
    }
  }

  return transposedMatrix;
}

function tilt(matrix: SpaceMatrix, tiltType: TiltType): SpaceMatrix {
  switch (tiltType) {
    case TiltType.NORTH: {
      return tiltNorth(matrix);
    }

    case TiltType.EAST: {
      return tiltEast(matrix);
    }

    case TiltType.SOUTH: {
      return tiltSouth(matrix);
    }

    case TiltType.WEST: {
      return tiltWest(matrix);
    }

    default: {
      throw new Error(`Unknown tilt type: ${tiltType}`);
    }
  }
}

interface CachedMatrix {
  matrix: SpaceMatrix;
  indices: number[];
}

function stringifyMatrix(matrix: SpaceMatrix): string {
  return matrix.map((row) => row.join("")).join("\n");
}

function cycle(matrix: SpaceMatrix, cycles = 1, cycle = 0): SpaceMatrix {
  const cache = new Map<string, CachedMatrix>();

  let cycledMatrix = copyMatrix(matrix);
  for (let i = cycle; i < cycles; i++) {
    for (const tiltType of CYCLE) {
      cycledMatrix = tilt(cycledMatrix, tiltType);

      const stringifiedMatrix = stringifyMatrix(cycledMatrix);
      let cachedMatrix = cache.get(stringifiedMatrix);
      if (!cachedMatrix) {
        cachedMatrix = {
          matrix: copyMatrix(cycledMatrix),
          indices: [],
        };
      }

      if (cachedMatrix.indices.length < 2) {
        cachedMatrix.indices.push(i);
      } else {
        const period = cachedMatrix.indices[1] - cachedMatrix.indices[0];
        i += Math.floor((cycles - i) / period) * period;
      }

      cache.set(stringifiedMatrix, cachedMatrix);
    }
  }

  return cycledMatrix;
}

export function sumTotalCycledLoadFromInput(
  input: string,
  cycles = 1_000_000_000,
): number {
  const matrix = parseSpaceMatrix(input);
  const cycledMatrix = cycle(matrix, cycles);
  console.log(cycledMatrix.map((row) => row.join("")).join("\n"));

  return sumTotalLoad(cycledMatrix);
}
