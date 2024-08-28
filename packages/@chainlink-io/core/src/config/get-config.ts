import path from "path";
import fs from "fs/promises";
import { cwd } from "process";
import { ChainlinkConfig, configSchema, defaultConfig } from "./define-config";
import { readTsFile } from "../read-ts/read-ts-file";

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
    return defaultConfig;
  }

  const config = (await readTsFile(configFilePath))?.default;

  if (typeof config !== "object") {
    throw new Error("Default export of chainlink.config.ts must be a valid Chainlink config")
  }

  // Merge with default values
  const mergedConfig = deepMerge<ChainlinkConfig>(
    defaultConfig,
    config,
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

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function deepMerge<T>(target: any, ...sources: any[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
