/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

self.addEventListener(
  "message",
  (message: Event) => {
    const { almanac, i } = message.data! as {
      almanac: Almanac;
      i: number;
    };
    let recordLocation = Infinity;
    for (let j = 0; j < almanac.seeds[i + 1]; j++) {
      const seed = almanac.seeds[i] + j;
      const converted = convert(
        almanac,
        "seed",
        "location",
        { [seed]: seed },
      );
      recordLocation = Math.min(...Object.values(converted), recordLocation);
      if (j % 100_000 === 0) {
        j !== 0 && console.log(
          `completion: ${j / almanac.seeds[i + 1]}% (${
            i + 1
          }/${almanac.seeds.length})`,
        );
      }
    }

    self.postMessage(recordLocation);
    self.close();
  },
);

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
