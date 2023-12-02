import { existsSync } from "https://deno.land/std@0.208.0/fs/mod.ts";

const envFilename = ".env";
const regex = /(?<=AOC_SESSION=)(.*)/g;

if (import.meta.main) {
  // If no session token is provided, exit.
  const session = Deno.args[0];
  if (!session) {
    console.log("Please provide a session token in the first argument.");
    Deno.exit();
  }

  // If .env does not exist, create one.
  const exists = existsSync(envFilename);
  const empty = exists ? Deno.readTextFileSync(envFilename) === "" : false;
  if (!exists || empty) {
    Deno.writeTextFileSync(envFilename, `AOC_SESSION="${session}"`);
    console.log("Created .env file.");
    Deno.exit();
  }

  // If .env is empty, set first line.
  const envString = Deno.readTextFileSync(".env");

  // If .env has session, replace it.
  const sessionExists = regex.test(envString);
  const nextEnvString = sessionExists
    ? envString.replace(regex, `"${session}"`)
    : `${envString}\nAOC_SESSION="${session}"`;

  // Write to .env file.
  Deno.writeTextFileSync(".env", nextEnvString);
  console.log("Updated .env file.");
}
