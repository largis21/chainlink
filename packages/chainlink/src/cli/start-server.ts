import { spawn } from "child_process";
import path from "path";

function startNodeInstance(scriptName: string) { }

export function startServer(config: { port?: string; configPath?: string }) {
  spawn(
    "node",
    [path.resolve(import.meta.dirname, "./app/server.js")],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: "production",
        VITE_PORT: config.port || "4202",
        VITE_CONFIG_PATH: config.configPath,
      },
    },
  );
}
