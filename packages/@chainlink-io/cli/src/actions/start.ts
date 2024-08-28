import { serveApp } from "@chainlink-io/app";
import { type ChainlinkConfig } from "@chainlink-io/core";

export function cliActionStart(port: string | null, config: ChainlinkConfig) {
  serveApp(parseInt(port || "4202"), config)
}
