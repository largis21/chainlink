#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path"

function startNodeInstance(scriptName: string, env: Record<string, string>) {
  const newProcess = spawn("node", [scriptName], {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });

  newProcess.on("close", (code) => {
    console.log(`${scriptName} exited with code ${code}`);
  });

  newProcess.on("error", (err) => {
    console.error(`Failed to start ${scriptName}: ${err}`);
  });

  return newProcess;
}

async function run() {
  console.log("Running Chainlink...")

  startNodeInstance(path.resolve(__dirname, "../app/packages/@chainlink/app/server.js"), {})
}

run()


