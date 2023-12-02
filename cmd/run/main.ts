import { parseArgs } from "https://deno.land/std@0.208.0/cli/mod.ts";

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["year", "day"],
    alias: {
      year: "y",
      day: "d",
    },
  });
  if (flags.year === undefined) {
    console.error("Missing year");
    Deno.exit(1);
  }

  if (flags.day === undefined) {
    console.error("Missing day");
    Deno.exit(1);
  }

  // Create a child process using Deno.Command, running the script.
  const child = new Deno.Command(Deno.execPath(), {
    args: ["run", "-A", `./${flags.year}/${flags.day}/main.ts`],
    stdin: "piped",
    stdout: "piped",
  }).spawn();

  // Pipe the current process stdin to the child process stdin.
  child.stdout.pipeTo(Deno.stdout.writable);
}
