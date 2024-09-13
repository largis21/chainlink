import path from "path";
import { watch } from "rollup";
import { loadConfigFile } from "rollup/loadConfigFile";
import { spawn } from "node:child_process";

const { options: config, warnings } = await loadConfigFile(
  path.resolve(import.meta.dirname, "rollup.config.mjs"),
  {
    format: "es",
  },
);

const watcher = watch(config);

let current = null;

watcher.on("event", (e) => {
  if (e.result) {
    if (current) {
      current.kill?.();
    }

    current = spawn("node", [path.resolve(import.meta.dirname, "dist")], {
      detached: false,
      stdio: ["pipe", "inherit", "inherit"],
    }).listeners;
    e.result.close();
  }
});
