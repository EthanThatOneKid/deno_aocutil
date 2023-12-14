import * as parabolic_reflector_dish from "./parabolic_reflector_dish.ts";

if (import.meta.main) {
  const part1Solution = await part1();
  const part2Solution = await part2();
  console.table({
    "Part 1": { solution: part1Solution },
    "Part 2": { solution: part2Solution },
  });
}

async function part1() {
  const input = await Bun.file("./2023/14/input").text();
  return parabolic_reflector_dish.sumTotalLoadFromInput(input);
}

async function part2() {
  const input = await Bun.file("./2023/14/input").text();
  return parabolic_reflector_dish.sumTotalCycledLoadFromInput(input);
}
