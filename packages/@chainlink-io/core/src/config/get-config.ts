import {
  ChainlinkConfig,
  userChainlinkConfigSchema,
} from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";
import { cwd } from "process";

import { __readTsFile, deepMerge } from "@/utils";

import { defaultConfig } from ".";
const configLocationPrec = [
  "chainlink.config.ts",
  "chainlink.config.js",
  "chainlink.config.mjs",
  "chainlink/chainlink.config.ts",
  "chainlink/chainlink.config.js",
  "chainlink/chainlink.config.mjs",
].map((e) => path.resolve(cwd(), e));

async function getConfigFilePath(): Promise<null | string> {
  for (const possibleLocation of configLocationPrec) {
    try {
      await fs.readFile(possibleLocation);
      return possibleLocation;
    } catch {
      continue;
    }
  }

  return null;
}

export async function getConfig(configPath?: string): Promise<ChainlinkConfig> {
  const configFilePath = configPath || (await getConfigFilePath());

  if (!configFilePath) {
    console.warn(
      "Could not find a chainlink config file, using default config...",
    );
    return defaultConfig;
  }

  const config = (await __readTsFile(configFilePath)).exports?.default;

  const parsedConfig = userChainlinkConfigSchema.safeParse(config);

  if (!parsedConfig.success) {
    throw new Error(
      "Default export of chainlink.config.ts must be a valid Chainlink config",
    );
  }

  const mergedConfig = deepMerge<ChainlinkConfig>(
    defaultConfig,
    parsedConfig.data,
  );

  // If the user specified a config path and did not specify rootDir, set rootDir to the chainlink
  // directory in the file's location, not cwd which is default
  // Will also make sure that the path is absolute so the code below doesn't change it again
  if (configPath && !(config as ChainlinkConfig).chainlinkRootDir) {
    mergedConfig.chainlinkRootDir = path.resolve(configPath, "../chainlink");
  }

  // If the path is relative, make it absolute
  if (!path.isAbsolute) {
    mergedConfig.chainlinkRootDir = path.resolve(
      process.cwd(),
      mergedConfig.chainlinkRootDir,
    );
  }

  return mergedConfig;
}
