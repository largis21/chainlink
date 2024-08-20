import { spawn } from "child_process";
import path from "path";

// Function to start a Node.js instance
function startNodeInstance(scriptName: string) {
  const newProcess = spawn("node", [scriptName], {
    stdio: "inherit",
    env: { ...process.env, PORT: "3000" },
  });

  newProcess.on("close", (code) => {
    console.log(`${scriptName} exited with code ${code}`);
  });

  newProcess.on("error", (err) => {
    console.error(`Failed to start ${scriptName}: ${err}`);
  });

  return newProcess;
}

// Start two Node.js instances in parallel
const instance1 = startNodeInstance(
  path.resolve(import.meta.dirname, "start-backend.js"),
);
// const instance2 = startNodeInstance('script2.js');

// Optionally, handle the termination of the main script
process.on("SIGINT", () => {
  console.log("Terminating child processes...");
  instance1.kill();
  // instance2.kill();
  process.exit();
});
