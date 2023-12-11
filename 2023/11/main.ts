import * as aocutil from "aocutil/aocutil.ts";
import * as cosmic_expansion from "./cosmic_expansion.ts";

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

  // await aocapi.submitPart1({ year: "2023", day: "11" }, part1Solution);
  // await aocapi.submitPart2({ year: "2023", day: "11" }, part2Solution);
}

function part1() {
  const input = aocutil.readFile("./2023/11/input");
  const cosmos = cosmic_expansion.parseCosmos(input);
  const expanded = cosmic_expansion.expandCosmos(cosmos);
  let sum = 0;
  cosmic_expansion.walkPairs(
    expanded.galaxies,
    (a, b) => {
      sum += cosmic_expansion.between(a, b);
    },
  );
  return sum;
}

function part2() {
}
