type CrucibleHeatLoss = number;
type HeatLossMatrix = CrucibleHeatLoss[][];

function parseHeatLossMatrix(input: string): HeatLossMatrix {
  return input
    .split("\n")
    .filter((row) => row.trim().length > 0)
    .map((row) => row.trim())
    .map((row) =>
      row
        .split("")
        .filter((cell) => cell.trim().length > 0)
        .map((cell) => parseInt(cell))
    );
}

interface Position2D {
  row: number;
  col: number;
}

type Position2DKey = `${number},${number}`;

function makePosition2DKey(p: Position2D): Position2DKey {
  return `${p.row},${p.col}`;
}

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
] satisfies Position2D[];

interface Crucible {
  totalHeatLoss: number;
  movesSinceLastTurn: number;
  position: Position2D;
  velocity: Position2D;
}

function makeCrucible(
  totalHeatLoss: number,
  movesSinceLastTurn: number,
  position: Position2D,
  velocity: Position2D,
): Crucible {
  return {
    totalHeatLoss,
    movesSinceLastTurn,
    position,
    velocity,
  };
}

function calculateMinHeatLoss(
  matrix: HeatLossMatrix,
  initialPosition: Position2D = { row: 0, col: 0 },
  finalPosition: Position2D = {
    row: matrix.length - 1,
    col: matrix[0].length - 1,
  },
): number {
  let minHeatLoss = Number.POSITIVE_INFINITY;
  const stack: Crucible[] = [{
    totalHeatLoss: 0,
    movesSinceLastTurn: 0,
    position: initialPosition,
    velocity: { row: 0, col: 1 },
  }];
  //   const visited: Set<Position2DKey> = new Set();
  let count = 0;
  while (stack.length > 0) {
    const c = stack.shift();
    if (!c) {
      throw new Error("Unexpected empty stack");
    }

    for (const d of DIRECTIONS) {
      // If the direction is opposite of the current crucible velocity,
      // ignore it.
      if (
        c.velocity.row === -d.row &&
        c.velocity.col === -d.col
      ) {
        continue;
      }

      // If new crucible is out of bounds, ignore it.
      const row = c.position.row + d.row;
      const col = c.position.col + d.col;
      if (
        row < 0 ||
        row >= matrix.length ||
        col < 0 ||
        col >= matrix[0].length
      ) {
        continue;
      }

      // If new crucible is turning, reset movesSinceLastTurn to 0.
      const isTurning = d.col !== c.velocity.col ||
        d.row !== c.velocity.row;
      const newCrucible = makeCrucible(
        c.totalHeatLoss + matrix[row][col],
        isTurning ? 0 : c.movesSinceLastTurn + 1,
        { row, col },
        d,
      );

      // If crucible has not turned in 3 moves, ignore it.
      if (newCrucible.movesSinceLastTurn >= 3) {
        continue;
      }

      // If crucible reaches final position, update min heat loss.
      if (
        newCrucible.position.row === finalPosition.row &&
        newCrucible.position.col === finalPosition.col
      ) {
        minHeatLoss = Math.min(minHeatLoss, newCrucible.totalHeatLoss);
        continue;
      }

      // Insert new crucible into stack by heat loss.
      const insertIndex = stack
        .findIndex((c) => c.totalHeatLoss > newCrucible.totalHeatLoss);
      if (insertIndex === -1) {
        stack.push(newCrucible);
      } else {
        stack.splice(insertIndex, 0, newCrucible);
      }
    }

    if (count > 0) {
      console.log(`stack.length: ${stack.length}, count: ${count}`);
      if (count % 10 === 0) {
        return minHeatLoss;
      }
    }
  }

  //     for (let i = stack.length - 1; i >= 0; i--) {
  //       const c = stack[i];
  //       for (const d of DIRECTIONS) {
  //         // If new crucible is out of bounds, ignore it.
  //         const row = c.position.row + d.row;
  //         const col = c.position.col + d.col;
  //         if (
  //           row < 0 ||
  //           row >= matrix.length ||
  //           col < 0 ||
  //           col >= matrix[0].length
  //         ) {
  //           continue;
  //         }

  //         // If new crucible velocity is opposite of current crucible velocity,
  //         // ignore it.
  //         if (
  //           c.velocity.row === -d.row &&
  //           c.velocity.col === -d.col
  //         ) {
  //           continue;
  //         }

  //         // If new crucible is turning, reset movesSinceLastTurn to 0.
  //         const isTurning = d.col !== c.velocity.col ||
  //           d.row !== c.velocity.row;
  //         const newCrucible = makeCrucible(
  //           c.totalHeatLoss + matrix[row][col],
  //           isTurning ? 0 : c.movesSinceLastTurn + 1,
  //           { row, col },
  //           d,
  //         );

  //         // If crucible has not turned in 3 moves, ignore it.
  //         if (newCrucible.movesSinceLastTurn >= 3) {
  //           continue;
  //         }

  //         // If crucible reaches final position, update min heat loss.
  //         if (
  //           newCrucible.position.row === finalPosition.row &&
  //           newCrucible.position.col === finalPosition.col
  //         ) {
  //           minHeatLoss = Math.min(minHeatLoss, newCrucible.totalHeatLoss);
  //         }

  //         stack.push(newCrucible);
  //       }

  //       stack.splice(i, 1);
  //     }

  //     // if (count % 10 === 0 && count > 0) {
  //     console.log(`stack.length: ${stack.length}, count: ${count}`);
  //     //   return minHeatLoss;
  //     // }

  //     // if (count % 10 === 0 && count > 0) {
  //     //   return minHeatLoss;
  //     // }

  //     count++;
  //     // console.log(`stack.length: ${stack.length}, count: ${count}`);
  //   }

  return minHeatLoss;
}

export function calculateMinHeatLossFromInput(input: string): number {
  const matrix = parseHeatLossMatrix(input);
  return calculateMinHeatLoss(matrix);
}
