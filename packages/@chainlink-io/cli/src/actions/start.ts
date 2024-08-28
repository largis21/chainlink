import { serveApp } from "@chainlink-io/app";
import { type ChainlinkConfig } from "@chainlink-io/core";

export function cliActionStart(config: ChainlinkConfig) {
  serveApp(config)
}
