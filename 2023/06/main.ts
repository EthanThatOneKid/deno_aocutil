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
  // Sample.
  // const times = [7, 15, 30];
  // const distances = [9, 40, 200];

  const times = [45, 97, 72, 95];
  const distances = [305, 1062, 1110, 1695];
  const winners = times.map((time, i) => getWinners(time, distances[i]));
  const possibilites = winners.reduce((acc, cur) => acc * cur, 1);
  return possibilites;
}

function part2() {
  // Sample.
  // const time = 71530;
  // const distance = 940200;

  const time = 45977295;
  const distance = 305106211101695;
  const winners = getWinners(time, distance);
  return winners;
}

function getWinners(time: number, distance: number) {
  let i = 0;
  let winners = 0;
  while (i < time) {
    const farthest = launch(time, i);
    if (farthest > distance) {
      winners++;
    }

    i++;
  }

  return winners;
}

function launch(time: number, hold: number) {
  const remaining = time - hold;
  const speed = hold;
  const destination = speed * remaining;
  return destination;
}
