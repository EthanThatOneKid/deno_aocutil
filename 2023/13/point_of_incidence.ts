enum PointType {
  ASH = ".",
  ROCKS = "#",
}

export function parseInput(input: string): PointType[][][] {
  const result: PointType[][][] = [];
  let currentLayer: PointType[][] = [];
  for (const line of input.split("\n")) {
    const trimmedLine = line.trim();
    if (trimmedLine.length === 0) {
      result.push(currentLayer);
      currentLayer = [];
      continue;
    }

    currentLayer.push(trimmedLine.split("") as PointType[]);
  }

  if (currentLayer.length !== 0) {
    result.push(currentLayer);
  }

  return result;
}

type Line =
  | { x: number }
  | { y: number };

function findVerticalReflectionLine(
  matrix: PointType[][],
): { y: number } | undefined {
  let y: number;
  loop_y: for (y = 0; y < matrix.length - 1; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== matrix[y + 1][x]) {
        continue loop_y;
      }
    }

    const mirrorLength = Math.min(y, matrix.length - y - 2);
    for (let i = 0; i < mirrorLength; i++) {
      for (let j = 0; j < matrix[y].length; j++) {
        const a = matrix[y - i - 1][j];
        const b = matrix[y + i + 2][j];
        if (a !== b) {
          continue loop_y;
        }
      }
    }

    return { y };
  }
}

function transpose<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export function findReflectionLine(
  matrix: PointType[][],
  verticalReflectionFinder: typeof findVerticalReflectionLine,
): Line {
  const verticalReflectionLine = verticalReflectionFinder(matrix);
  if (verticalReflectionLine) {
    return verticalReflectionLine;
  }

  const horizontalReflectionLine = verticalReflectionFinder(
    transpose(matrix),
  );
  if (horizontalReflectionLine) {
    return { x: horizontalReflectionLine.y };
  }

  throw new Error("No reflection line found");
}

// To summarize your pattern notes, add up the number of columns to the left of each vertical line of reflection; to that, also add 100 multiplied by the number of rows above each horizontal line of reflection. In the above example, the first pattern's vertical line has 5 columns to its left and the second pattern's horizontal line has 4 rows above it, a total of 405.
function summarizeMatrix(
  matrix: PointType[][],
  verticalReflectionFinder: typeof findVerticalReflectionLine,
): number {
  const reflectionLine = findReflectionLine(matrix, verticalReflectionFinder);
  return "x" in reflectionLine
    ? (reflectionLine.x + 1)
    : (reflectionLine.y + 1) * 100;
}

export function summarizeMatrices(
  matrices: PointType[][][],
  verticalReflectionFinder = findVerticalReflectionLine,
): number {
  const sum = matrices.reduce((result, matrix) => {
    return result + summarizeMatrix(matrix, verticalReflectionFinder);
  }, 0);
  return sum;
}

export function findVerticalReflectionLineWithSmudge(
  matrix: PointType[][],
): { y: number } | undefined {
  let y: number;
  loop_y: for (y = 0; y < matrix.length - 1; y++) {
    let smudgeThreshold = 1;
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== matrix[y + 1][x]) {
        smudgeThreshold--;
        if (smudgeThreshold < 0) {
          continue loop_y;
        }
      }
    }

    const mirrorLength = Math.min(y, matrix.length - y - 2);
    for (let i = 0; i < mirrorLength; i++) {
      for (let j = 0; j < matrix[y].length; j++) {
        const a = matrix[y - i - 1][j];
        const b = matrix[y + i + 2][j];
        if (a !== b) {
          smudgeThreshold--;
          if (smudgeThreshold < 0) {
            continue loop_y;
          }
        }
      }
    }

    return { y };
  }
}
