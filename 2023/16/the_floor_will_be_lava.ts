enum TileType {
  EMPTY = ".",
  FORWARD_MIRROR = "/",
  BACK_MIRROR = "\\",
  VERT_SPLITTER = "|",
  HORIZ_SPLITTER = "-",
}

interface Vector2D {
  x: number;
  y: number;
}

interface Tile {
  type: TileType;
  position: Vector2D;
}

function parseTiles(input: string): Tile[] {
  const tiles = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, y) =>
      line.split("")
        .map((c, x) => {
          switch (c) {
            case TileType.EMPTY:
            case TileType.FORWARD_MIRROR:
            case TileType.BACK_MIRROR:
            case TileType.VERT_SPLITTER:
            case TileType.HORIZ_SPLITTER: {
              return { type: c, position: { x, y } };
            }

            default: {
              throw new Error(`Unknown tile type: ${c}`);
            }
          }
        })
    );

  return tiles.flat();
}

type TileMapKey = `${number},${number}`;

function makeTileMapKey(position: Vector2D): TileMapKey {
  return `${position.x},${position.y}`;
}

type TileMap = Map<TileMapKey, Tile>;

function makeTileMap(tiles: Tile[]): TileMap {
  const tileMap = new Map<TileMapKey, Tile>();
  for (const tile of tiles) {
    tileMap.set(makeTileMapKey(tile.position), tile);
  }

  return tileMap;
}

function redirectBeam(tileType: TileType, v: Vector2D): Vector2D[] {
  switch (tileType) {
    case TileType.FORWARD_MIRROR: {
      return [{ x: v.y * -1, y: v.x * -1 }];
    }

    case TileType.BACK_MIRROR: {
      return [{ x: v.y * 1, y: v.x * 1 }];
    }

    case TileType.VERT_SPLITTER: {
      if (v.y !== 0) {
        return [{ ...v }];
      }

      return [
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];
    }

    case TileType.HORIZ_SPLITTER: {
      if (v.x !== 0) {
        return [{ ...v }];
      }

      return [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
      ];
    }

    case TileType.EMPTY: {
      return [{ ...v }];
    }

    default: {
      throw new Error(`Cannot redirect beam from tile type: ${tileType}`);
    }
  }
}

interface Beam {
  position: Vector2D;
  velocity: Vector2D;
}

const initialBeam = {
  position: { x: 0, y: 0 },
  velocity: { x: 1, y: 0 },
} satisfies Beam;

type BeamKey = `${TileMapKey},${number},${number}`;

function makeBeamKey(b: Beam): BeamKey {
  return `${makeTileMapKey(b.position)},${b.velocity.x},${b.velocity.y}`;
}

// The beam enters in the top-left corner from the left and heading to the right.
// Then, its behavior depends on what it encounters as it moves.
function sumEnergizedTiles(tiles: Tile[]): number {
  const tileMap = makeTileMap(tiles);
  const beams: Beam[] = [{ ...initialBeam }];
  const visited = new Set<TileMapKey>();
  const visitedBeams = new Set<BeamKey>();
  //   let count = 0;
  //   let visitedSize = 0;
  while (beams.length > 0) {
    for (let i = beams.length - 1; i >= 0; i--) {
      // If the beam leaves the grid, remove it.
      const tileKey = makeTileMapKey(beams[i].position);
      const tile = tileMap.get(tileKey);
      if (tile === undefined) {
        throw new Error(
          `Beam left the grid at ${tileKey} (${
            makeTileMapKey(beams[i].velocity)
          })`,
        );
      }

      // Add the tile to the visited tiles set.
      visited.add(tileKey);

      // Add the current state to the visited beams set.
      const beamKey = makeBeamKey(beams[i]);
      visitedBeams.add(beamKey);
      //   console.log(visitedBeams);

      // Redirect the beam if necessary.
      const redirectedBeams = redirectBeam(
        tile.type,
        beams[i].velocity,
      )
        // Move the beams.
        .map((v): Beam => ({
          velocity: v,
          position: {
            x: v.x + beams[i].position.x,
            y: v.y + beams[i].position.y,
          },
        }))
        // Filter out beams that leave the grid or have already been visited.
        .filter((b) => {
          //   console.log(`Filtering beam ${makeBeamKey(b)}`);
          return tileMap.has(makeTileMapKey(b.position)) &&
            !visitedBeams.has(makeBeamKey(b));
        });

      // Apply the first redirection to the current beam, and add the rest to the list.
      if (redirectedBeams.length === 0) {
        beams.splice(i, 1);
        continue;
      } else {
        beams[i] = { ...redirectedBeams[0] };
        if (redirectedBeams.length > 1) {
          beams.push(...redirectedBeams.slice(1));
        }
      }

      //   if (i % 1_000_000 === 0 && i !== 0) {
      //     if (visitedSize === visited.size) {
      //       break main_loop;
      //     }

      //   visitedSize = visited.size;
      //   }
    }

    //     if (count % 100 === 0) {
    //       console.log(`count: ${count}, visited: ${visited.size}`);
    //       if (visitedSize === visited.size) {
    //         break;
    //       }

    //       visitedSize = visited.size;
    //     }

    //     count++;
  }

  return visited.size;
}

export function sumEnergizedTilesFromInput(input: string): number {
  const tiles = parseTiles(input);
  return sumEnergizedTiles(tiles);
}
