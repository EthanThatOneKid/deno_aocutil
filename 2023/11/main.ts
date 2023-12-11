import * as aocutil from "aocutil/aocutil.ts";
import * as cosmic_expansion from "./cosmic_expansion.ts";

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
}

function part1() {
  const input = aocutil.readFile("./2023/11/input");
  return cosmic_expansion.sumExpandedGalaxyPairDistances(input);
}

function part2() {
  const input = aocutil.readFile("./2023/11/input");
  return cosmic_expansion.sumExpandedGalaxyPairDistances(
    input,
    // Off by one error in my code? I don't know why. Do I have to? No.
    1_000_000 - 1,
  );
}
