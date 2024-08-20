import { spawn } from "child_process";
import path from "path";
import { getPort } from "./get-port.js";

// Function to start a Node.js instance
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

const backendPort = (await getPort(3000)).toString();
const frontendPort = (await getPort(4203)).toString();

const backendInstance = startNodeInstance(
  path.resolve(import.meta.dirname, "start-backend.js"),
  { PORT: backendPort, FRONTEND_ORIGIN: `http://localhost:${frontendPort}` },
);

// const instance2 = startNodeInstance('script2.js');

// Optionally, handle the termination of the main script
/* process.on("SIGINT", () => {
  console.log("Terminating child processes...");
  instance1.kill();
  // instance2.kill();
  process.exit();
}); */
