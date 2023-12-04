import * as aocutil from "aocutil/aocutil.ts";

if (import.meta.main) {
  part1();
  part2();
}

interface NumberPosition {
  id: number;
  position: [number, number];
}

function getNumberPositions(
  map: string[],
): NumberPosition[] {
  const numberPositions: NumberPosition[] = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      let symbol = row[x];
      let id = "";
      while (x < row.length && symbol.match(/[0-9]/) !== null) {
        id += symbol;
        x++;
        symbol = row[x];
      }

      if (id) {
        numberPositions.push({
          id: parseInt(id),
          position: [x - id.length, y],
        });
      }
    }
  }
  return numberPositions;
}

interface SymbolPosition {
  symbol: string;
  position: [number, number];
}

function isSymbol(c: string): boolean {
  return c.match(/[0-9]|\./) === null;
}

function getSymbolPositions(
  map: string[],
): SymbolPosition[] {
  const symbolPositions: SymbolPosition[] = [];
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    for (let x = 0; x < row.length; x++) {
      const symbol = row[x];
      if (isSymbol(symbol)) {
        symbolPositions.push({
          symbol,
          position: [x, y],
        });
      }
    }
  }
  return symbolPositions;
}

function isNumberAdjacentToSymbol(
  numberPosition: NumberPosition,
  symbolPositions: SymbolPosition[],
) {
  const positions = numberPosition.id
    .toString()
    .split("")
    .map((_, i) => {
      return [
        numberPosition.position[0] + i,
        numberPosition.position[1],
      ];
    });
  return symbolPositions.some((symbolPosition) =>
    positions.some((position) => {
      return isAdjacent(position as [number, number], symbolPosition.position);
    })
  );
}

// is adjacent or diagonal
function isAdjacent(
  c1: [number, number],
  c2: [number, number],
): boolean {
  const [x1, y1] = c1;
  const [x2, y2] = c2;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (x1 + i === x2 && y1 + j === y2) {
        return true;
      }
    }
  }

  return false;
}

function part1() {
  const input = aocutil.readFile("./2023/3/input");
  const map = input.split("\n").map((row) => row.trim());
  const numberPositions = getNumberPositions(map);
  const symbolPositions = getSymbolPositions(map);
  const partNumbers = numberPositions.filter((numberPosition) =>
    isNumberAdjacentToSymbol(numberPosition, symbolPositions)
  );
  const sum = partNumbers.reduce((acc, curr) => acc + curr.id, 0);
  console.log(sum);
}

function part2() {
  const input = aocutil.readFile("./2023/3/input");
  const map = input.split("\n").map((row) => row.trim());
  const numberPositions = getNumberPositions(map);
  const symbolPositions = getSymbolPositions(map);
  const gearsRatioSum = symbolPositions.reduce((acc, symbolPosition) => {
    const adjacentPartNumbers = numberPositions.filter((numberPosition) =>
      isNumberAdjacentToSymbol(numberPosition, [symbolPosition])
    );
    const isGear = symbolPosition.symbol === "*" &&
      adjacentPartNumbers.length === 2;
    if (isGear) {
      const gearRatio = adjacentPartNumbers.reduce(
        (acc, curr) => acc * curr.id,
        1,
      );
      acc += gearRatio;
    }

    return acc;
  }, 0);
  console.log(gearsRatioSum);
}
