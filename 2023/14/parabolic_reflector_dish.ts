enum SpaceType {
  EMPTY = ".",
  ROUNDED = "O",
  CUBE = "#",
}

// interface Position {
//   x: number;
//   y: number;
// }

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

// interface Rock {
//   type: RockType;
//   position: Position;
// }

// function parseRocks(input: string): Rock[] {
//   return input.split("\n")
//     .filter((line) => line.trim() !== "")
//     .reduce((result, line, y) => {
//       const chars = line.trim().split("");
//       for (let x = 0; x < chars.length; x++) {
//         const type = chars[x];
//         switch (type) {
//           case RockType.CUBE:
//           case RockType.ROUNDED: {
//             result.push({
//               type,
//               position: { x, y },
//             });
//             break;
//           }

//           default: {
//             throw new Error(`Unknown rock type: ${type}`);
//           }
//         }
//       }

//       return result;
//     }, [] as Rock[]);
// }

// enum TiltType {
//   NORTH,
//   EAST,
//   SOUTH,
//   WEST,
// }
//
// const TILTS = {
//   [TiltType.NORTH]: [0, -1],
//   [TiltType.EAST]: [1, 0],
//   [TiltType.SOUTH]: [0, 1],
//   [TiltType.WEST]: [-1, 0],
// } as const;

// function tilt(rocks: Rock[], tiltType: TiltType): Rock[] {
//   for (const rock of rocks) {
//   }
// }

function copyMatrix(matrix: SpaceMatrix): SpaceMatrix {
  return matrix.map((row) => row.slice());
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

function transposeMatrix(matrix: SpaceMatrix): SpaceMatrix {
  const newMatrix = copyMatrix(matrix);
  for (let i = 0; i < newMatrix.length; i++) {
    for (let j = 0; j < i; j++) {
      const temp = newMatrix[i][j];
      newMatrix[i][j] = newMatrix[j][i];
      newMatrix[j][i] = temp;
    }
  }

  return newMatrix;
}

function tiltEast(matrix: SpaceMatrix): SpaceMatrix {
  return transposeMatrix(tiltNorth(transposeMatrix(matrix)));
}

function tiltSouth(matrix: SpaceMatrix): SpaceMatrix {
  return tiltNorth(tiltNorth(matrix));
}

function tiltWest(matrix: SpaceMatrix): SpaceMatrix {
  return transposeMatrix(tiltSouth(transposeMatrix(matrix)));
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
  console.log(tiltedMatrix);
  return sumTotalLoad(tiltedMatrix);
}
