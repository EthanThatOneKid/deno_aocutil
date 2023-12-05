import * as aocutil from "aocutil/aocutil.ts";
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
  const input = aocutil.readFile("./2023/05/input");
  const a = parseAlmanac(input);
  const locationNumber = getLocationNumber2(a);
  return locationNumber;
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

function getLocationNumber2(
  almanac: Almanac,
): number {
  const seeds: number[] = [];
  for (let i = 0; i < almanac.seeds.length; i += 2) {
    seeds.push(
      ...Array.from(
        { length: almanac.seeds[i + 1] },
        (_, j) => j + almanac.seeds[i],
      ),
    );
  }

  const converted = convert(
    almanac,
    "seed",
    "location",
    Object.fromEntries(seeds.map((s) => [s, s])),
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

  const map = almanac.maps[key];
  const getNumber = makeGetNumber(map);
  const destinations = Object.fromEntries<number>(
    Object.entries<number>(numbers).map(([k, v]) => [v, Number(k)]),
  ) as Record<number, number>;
  for (const id in destinations) {
    numbers[destinations[id]] = getNumber(Number(id));
  }

  if (key.endsWith(`-to-${to}`)) {
    return numbers;
  }

  const nextFrom = key.split("-to-")[1];
  return convert(almanac, nextFrom, to, numbers);
}
