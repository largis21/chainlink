import { ChainlinkConfig } from "@chainlink-io/types";

export type ChainlinkContext = {
  globals: ChainlinkConfig["globals"];
  env: Record<string, string>;
};
