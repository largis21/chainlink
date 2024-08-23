import { spawn } from "child_process";
import path from "path";

function startNodeInstance(scriptName: string) {
    const process = spawn('node', [scriptName], { stdio: 'inherit' });

    process.on('close', (code) => {
        console.log(`${scriptName} exited with code ${code}`);
    });

    process.on('error', (err) => {
        console.error(`Failed to start ${scriptName}: ${err}`);
    });

    return process;
}

export function startServer() {
  startNodeInstance(path.resolve(import.meta.dirname, "../app/server.js"))
}
