import { parseESTFromArgs } from "aocutil/cmd/new/main.ts";

if (import.meta.main) {
  const est = parseESTFromArgs();

  // Create a child process using Deno.Command, running the script.
  const child = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      `./${est.year}/${est.day.toString().padStart(2, "0")}/main.ts`,
    ],
    stdin: "piped",
    stdout: "piped",
  }).spawn();

  // Pipe the current process stdin to the child process stdin.
  child.stdout.pipeTo(Deno.stdout.writable);
}
