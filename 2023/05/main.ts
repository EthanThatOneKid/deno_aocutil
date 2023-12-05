import * as aocutil from "aocutil/aocutil.ts";
import * as aocapi from "aocutil/aocapi.ts";

// Define constants.

if (import.meta.main) {
  performance.mark("part1");
  const part1Solution = await part1();

  performance.mark("part2");
  const part2Solution = await part2();

  performance.mark("end");
  const part1Measure = performance.measure("part1", "part1", "part2");
  const part2Measure = performance.measure("part2", "part2", "end");
  console.table({
    "Part 1": { solution: part1Solution, "time (ms)": part1Measure.duration },
    "Part 2": { solution: part2Solution, "time (ms)": part2Measure.duration },
  });

  console.log({ part1Solution, part2Solution });
}

function part1() {
  const input = aocutil.readFile("./2023/05/input");
  const a = parseAlmanac(input);
  const locationNumber = getLocationNumber(a);
  return locationNumber;
}

function part2() {
}

interface Almanac {
  seeds: number[];
  maps: {
    [name: string]: Range[];
  };
}

interface Range {
  sourceStart: number;
  destinationStart: number;
  length: number;
}

// const numbers: Record<number, number> = {};
// for (const { sourceStart, destinationStart, length } of map) {
//   for (let i = 0; i < length; i++) {
//     numbers[sourceStart + i] = destinationStart + i;

// Return a function that takes a number and returns the corresponding number in the map.
function makeGetNumber(map: Range[]): (n: number) => number {
  return (n: number) => {
    for (const { sourceStart, destinationStart, length } of map) {
      if (n >= sourceStart && n < sourceStart + length) {
        const offset = n - sourceStart;
        return destinationStart + offset;
      }
    }

    return n;
  };
}

function parseAlmanac(text: string): Almanac {
  const almanac: Almanac = {
    seeds: [],
    maps: {},
  };
  const lines = text.split("\n");
  let currentMapName = "";
  for (const line of lines) {
    if (line.startsWith("seeds: ")) {
      const seeds = line.split("seeds: ")[1].split(" ").map(Number);
      almanac.seeds = seeds;
      continue;
    }

    if (line.includes("map:")) {
      currentMapName = line.split(":")[0].trim().slice(0, -4);
      almanac.maps[currentMapName] = [];
      continue;
    }

    if (currentMapName === "" || line.trim() === "") {
      continue;
    }

    if (currentMapName in almanac.maps) {
      const [destinationStart, sourceStart, length] = line
        .split(" ")
        .map(Number);
      almanac.maps[currentMapName].push({
        sourceStart,
        destinationStart,
        length,
      });
    }
  }

  return almanac;
}

// With this map, you can look up the soil number required for each initial seed number:
// Seed number 79 corresponds to soil number 81.
// Seed number 14 corresponds to soil number 14.
// Seed number 55 corresponds to soil number 57.
// Seed number 13 corresponds to soil number 13.
// The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed. Using these maps, find the lowest location number that corresponds to any of the initial seeds. To do this, you'll need to convert each seed number through other categories until you can find its corresponding location number. In this example, the corresponding types are:
// Seed 79, soil 81, fertilizer 81, water 81, light 74, temperature 78, humidity 78, location 82.
// Seed 14, soil 14, fertilizer 53, water 49, light 42, temperature 42, humidity 43, location 43.
// Seed 55, soil 57, fertilizer 57, water 53, light 46, temperature 82, humidity 82, location 86.
// Seed 13, soil 13, fertilizer 52, water 41, light 34, temperature 34, humidity 35, location 35.
// So, the lowest location number in this example is 35.
function getLocationNumber(
  almanac: Almanac,
): number {
  const converted = convert(
    almanac,
    "seed",
    "location",
    Object.fromEntries(almanac.seeds.map((s) => [s, s])),
  );

  const locationNumber = Math.min(...Object.values(converted));
  return locationNumber;
}

function convert(
  almanac: Almanac,
  from: string,
  to: string,
  numbers: Record<number, number>,
): Record<number, number> {
  const key = Object.keys(almanac.maps)
    .find((k) => k.startsWith(`${from}-to-`));
  if (!key) {
    throw new Error(`no map for ${from} to ${to}`);
  }

  // console.log({ key });
  const map = almanac.maps[key];
  const getNumber = makeGetNumber(map);
  const destinations = Object.fromEntries<number>(
    Object.entries<number>(numbers).map(([k, v]) => [v, Number(k)]),
  ) as Record<number, number>;
  for (const id in destinations) {
    numbers[destinations[id]] = getNumber(Number(id));
  }

  // numbers = getNumbers(Object.values(numbers), map);
  if (key.endsWith(`-to-${to}`)) {
    return numbers;
  }

  const nextFrom = key.split("-to-")[1];
  return convert(almanac, nextFrom, to, numbers);
}
