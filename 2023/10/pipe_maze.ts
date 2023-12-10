const START_CHARACTER = "S";

enum PipeType {
  Vertical = "|",
  Horizontal = "-",
  NorthEast = "L",
  NorthWest = "J",
  SouthEast = "F",
  SouthWest = "7",
}

// PIPE_CONNECTIONS maps defines the allowed connections between pipes.
const PIPE_CONNECTIONS: Record<string, Point[]> = {
  // S
  [`${START_CHARACTER}${PipeType.Vertical}`]: [`0,1`, `0,-1`],
  [`${START_CHARACTER}${PipeType.Horizontal}`]: [`1,0`, `-1,0`],
  [`${START_CHARACTER}${PipeType.NorthEast}`]: [`1,0`, `0,-1`],
  [`${START_CHARACTER}${PipeType.NorthWest}`]: [`-1,0`, `0,-1`],
  [`${START_CHARACTER}${PipeType.SouthEast}`]: [`1,0`, `0,1`],
  [`${START_CHARACTER}${PipeType.SouthWest}`]: [`-1,0`, `0,1`],

  // |
  [`${PipeType.Vertical}${PipeType.Vertical}`]: [`0,-1`, `0,1`],
  [`${PipeType.Vertical}${PipeType.NorthEast}`]: [`0,1`],
  [`${PipeType.Vertical}${PipeType.NorthWest}`]: [`0,-1`],
  [`${PipeType.Vertical}${PipeType.SouthEast}`]: [`0,1`],
  [`${PipeType.Vertical}${PipeType.SouthWest}`]: [`0,-1`],

  // -
  [`${PipeType.Horizontal}${PipeType.Horizontal}`]: [`-1,0`, `1,0`],
  [`${PipeType.Horizontal}${PipeType.NorthEast}`]: [`1,0`],
  [`${PipeType.Horizontal}${PipeType.NorthWest}`]: [`-1,0`],
  [`${PipeType.Horizontal}${PipeType.SouthEast}`]: [`1,0`],
  [`${PipeType.Horizontal}${PipeType.SouthWest}`]: [`-1,0`],

  // F: E and S -> J, S -> L and vertical, E -> 7 and horizontal
  [`${PipeType.SouthEast}${PipeType.NorthWest}`]: [`1,0`, `0,1`],
  [`${PipeType.SouthEast}${PipeType.NorthEast}`]: [`0,1`],
  [`${PipeType.SouthEast}${PipeType.Vertical}`]: [`0,1`],
  [`${PipeType.SouthEast}${PipeType.SouthWest}`]: [`1,0`],
  [`${PipeType.SouthEast}${PipeType.Horizontal}`]: [`1,0`],

  // 7: W and S -> L, S -> J and vertical, W -> F and horizontal
  // Untested.
  [`${PipeType.SouthWest}${PipeType.NorthEast}`]: [`-1,0`, `0,1`],
  [`${PipeType.SouthWest}${PipeType.NorthWest}`]: [`0,1`],
  [`${PipeType.SouthWest}${PipeType.Vertical}`]: [`0,1`],
  [`${PipeType.SouthWest}${PipeType.SouthEast}`]: [`-1,0`],
  [`${PipeType.SouthWest}${PipeType.Horizontal}`]: [`-1,0`],

  // J: N and W -> F, N -> 7 and vertical, W -> L and horizontal
  // Untested.
  [`${PipeType.NorthWest}${PipeType.SouthEast}`]: [`-1,0`, `0,-1`],
  [`${PipeType.NorthWest}${PipeType.SouthWest}`]: [`0,-1`],
  [`${PipeType.NorthWest}${PipeType.Vertical}`]: [`0,-1`],
  [`${PipeType.NorthWest}${PipeType.NorthEast}`]: [`-1,0`],
  [`${PipeType.NorthWest}${PipeType.Horizontal}`]: [`-1,0`],

  // L: E and N -> 7, N -> F and vertical, E -> J and horizontal
  [`${PipeType.NorthEast}${PipeType.SouthWest}`]: [`1,0`, `0,-1`],
  [`${PipeType.NorthEast}${PipeType.SouthEast}`]: [`0,-1`],
  [`${PipeType.NorthEast}${PipeType.Vertical}`]: [`0,-1`],
  [`${PipeType.NorthEast}${PipeType.NorthWest}`]: [`1,0`],
  [`${PipeType.NorthEast}${PipeType.Horizontal}`]: [`1,0`],
};

type Point = `${number},${number}`;
type ConnectionMap = Record<Point, Point[]>;

interface FurthestPoint {
  point: Point;
  distance: number;
}

interface Maze {
  start: Point;
  data: ConnectionMap;
  furthestPoint?: FurthestPoint;
}

function connects(p1: string, p2: string, delta: Point): boolean {
  const p1p2 = `${p1}${p2}`;
  //   const connected = PIPE_CONNECTIONS[p1p2]?.includes(delta);
  //   const connections = PIPE_CONNECTIONS[p1p2];
  //   console.log({ p1, p2, delta, connected, connections });

  return PIPE_CONNECTIONS[p1p2]?.includes(delta) ?? false;
}

function point(x: number, y: number): Point {
  return `${x},${y}`;
}

export function parseMaze(lines: string[]): Maze {
  const m: Maze = { start: point(-1, -1), data: {} };

  for (let y = 0; y < lines.length; y++) {
    const row = lines[y];
    for (let x = 0; x < row.length; x++) {
      const tile = row[x];
      if (tile === ".") {
        continue;
      }

      const neighbors: Point[] = [];

      // Check for start character.
      if (tile === START_CHARACTER) {
        m.start = point(x, y);
      }

      // Check for vertically adjacent pipes.
      if (y > 0) {
        const above = lines[y - 1][x];
        if (connects(tile, above, point(0, -1))) {
          neighbors.push(point(x, y - 1));
        }
      }

      if (y < lines.length - 1) {
        const below = lines[y + 1][x];
        if (connects(tile, below, point(0, 1))) {
          neighbors.push(point(x, y + 1));
        }
      }

      // Check for horizontally adjacent pipes.
      if (x > 0) {
        const left = row[x - 1];
        if (connects(tile, left, point(-1, 0))) {
          neighbors.push(point(x - 1, y));
        }
      }

      if (x < row.length - 1) {
        const right = row[x + 1];
        if (connects(tile, right, point(1, 0))) {
          neighbors.push(point(x + 1, y));
        }
      }

      if (neighbors.length !== 0) {
        m.data[point(x, y)] = neighbors;
      }
    }
  }

  // TODO: Figure out how to find the furthest point.
  // m.furthestPoint = findFurthestPoint(m);
  return m;
}

export function renderMaze(m: Maze): string {
  const lines: string[] = [
    `Start: ${m.start}`,
    `Furthest Point: ${m.furthestPoint?.point} (${m.furthestPoint?.distance})`,
  ];
  const keys = Object.keys(m.data);
  const minX = Math.min(...keys.map((key) => parseInt(key.split(",")[0])));
  const maxX = Math.max(...keys.map((key) => parseInt(key.split(",")[0])));
  const minY = Math.min(...keys.map((key) => parseInt(key.split(",")[1])));
  const maxY = Math.max(...keys.map((key) => parseInt(key.split(",")[1])));

  for (let y = minY; y <= maxY; y++) {
    const row: string[] = [];
    for (let x = minX; x <= maxX; x++) {
      const tile = m.data[point(x, y)];
      if (tile) {
        row.push("#");
      } else {
        row.push(".");
      }
    }
    lines.push(row.join(""));
  }

  return lines.join("\n");
}

function findFurthestPoint(m: Maze): FurthestPoint {
  const visited: Set<Point> = new Set();
  const distance: Map<Point, number> = new Map();
  distance.set(m.start, 0);

  function distanceOf(p: Point): number {
    return distance.get(p) ?? 0;
  }

  const queue: Point[] = [m.start];
  let furthestPoint: Point | undefined;
  let maxDistance = 0;
  while (queue.length > 0) {
    const currentPoint = queue.shift();
    if (!currentPoint) {
      break;
    }

    visited.add(currentPoint);
    const neighbors = m.data[currentPoint];
    if (!neighbors) {
      continue;
    }

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        distance.set(neighbor, distanceOf(currentPoint) + 1);
        if (distanceOf(neighbor) > maxDistance) {
          furthestPoint = neighbor;
          maxDistance = distanceOf(neighbor);
        }
      }
    }
  }

  if (!furthestPoint) {
    throw new Error("Could not find furthest point");
  }

  return { point: furthestPoint, distance: maxDistance };
}
