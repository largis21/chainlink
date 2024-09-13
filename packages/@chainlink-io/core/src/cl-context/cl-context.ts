import { ChainlinkConfig } from "@/config";

export type ChainlinkContext = {
  globals: ChainlinkConfig["globals"];
  env: Record<string, string>;
};
