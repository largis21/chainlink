import { serveApp } from "@chainlink-io/app";

export function cliActionStart(config: { port?: string; configPath?: string }) {
  serveApp(parseInt(config.port || "4202"))
}
