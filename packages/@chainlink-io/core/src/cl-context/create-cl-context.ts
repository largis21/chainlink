import { ChainlinkConfig } from "@/config";

import { ChainlinkContext } from ".";

export function createClContext(config: ChainlinkConfig): ChainlinkContext {
  return {
    globals: config.globals,
    // @TODO
    env: {}
  }
}
