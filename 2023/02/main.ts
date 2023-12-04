import * as aocutil from "aocutil/aocutil.ts";

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

if (import.meta.main) {
  part2();
}

function part1() {
  const input = aocutil.readFile("./2023/02/input");
  const games = input.split("\n").map(parseGame).filter(isGamePossible);
  for (const g of games) {
    console.log(g.id, powerOf(g));
  }

  const sum = games.reduce((acc, g) => acc + g.id, 0);
  console.log(sum);
}

// Part 2.
function part2() {
  const input = aocutil.readFile("./2023/02/input");
  const games = input.split("\n").map(parseGame); //.filter(isGamePossible);

  const sum = games.reduce((acc, g) => acc + powerOf(g), 0);
  console.log(sum);
}

interface CubeSet {
  blue: number;
  green: number;
  red: number;
}

interface Game {
  id: number;
  cubeSets: CubeSet[];
}

function parseGame(text: string): Game {
  const id = Number(text.slice(5, text.indexOf(":")));
  const setStrings = text.slice(text.indexOf(":") + 2).split("; ");
  const cubeSets: CubeSet[] = [];
  for (const setString of setStrings) {
    const cubeSet: CubeSet = {
      blue: 0,
      green: 0,
      red: 0,
    };
    const colors = setString.trim().split(", ");
    for (const color of colors) {
      const [count, colorName] = color.split(" ");
      cubeSet[colorName as "green" | "blue" | "red"] = Number(count);
    }

    cubeSets.push(cubeSet);
  }

  return { id, cubeSets };
}

// The Elf would first like to know which games would have been possible if the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?
function isGamePossible(g: Game): boolean {
  for (const cubeSet of g.cubeSets) {
    if (
      cubeSet.red > MAX_RED ||
      cubeSet.green > MAX_GREEN ||
      cubeSet.blue > MAX_BLUE
    ) {
      return false;
    }
  }

  return true;
}

// The power of a set of cubes is equal to the numbers of red, green, and blue cubes multiplied together. The power of the minimum set of cubes in game 1 is 48. In games 2-5 it was 12, 1560, 630, and 36, respectively. Adding up these five powers produces the sum 2286.
function powerOf(game: Game): number {
  const gameSet: CubeSet = {
    blue: 0,
    green: 0,
    red: 0,
  };
  for (const cubeSet of game.cubeSets) {
    if (cubeSet.red > gameSet.red) {
      gameSet.red = cubeSet.red;
    }

    if (cubeSet.green > gameSet.green) {
      gameSet.green = cubeSet.green;
    }

    if (cubeSet.blue > gameSet.blue) {
      gameSet.blue = cubeSet.blue;
    }
  }

  return gameSet.red * gameSet.green * gameSet.blue;
}
