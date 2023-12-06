import { parseESTFromArgs } from "aocutil/cmd/new/main.ts";

if (import.meta.main) {
  const est = parseESTFromArgs();

  // Create a child process using Deno.Command, running the script.
  new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      `./${est.year}/${est.day.toString().padStart(2, "0")}/main.ts`,
    ],
    stdin: "inherit",
    stdout: "inherit",
  }).spawn();
}
