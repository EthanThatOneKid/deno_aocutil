import * as aocutil from "aocutil/aocutil.ts";
import * as point_of_incidence from "./point_of_incidence.ts";

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
  const input = aocutil.readFile("./2023/13/input");
  const parsedInput = point_of_incidence.parseInput(input);
  const result = point_of_incidence.summarizeMatrices(parsedInput);
  return result;
}

function part2() {
  const input = aocutil.readFile("./2023/13/sample_input");
  const parsedInput = point_of_incidence.parseInput(input);
  const result = point_of_incidence.summarizeMatrices(
    parsedInput,
    point_of_incidence.findVerticalReflectionLineWithSmudge,
  );
  return result;
}
