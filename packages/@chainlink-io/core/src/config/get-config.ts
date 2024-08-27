import path from "path";
import fs from "fs/promises";
import { cwd } from "process";
import { ChainlinkConfig, configSchema, defaultConfig } from "./define-config";
import { readTsFile } from "../read-ts/read-ts-file";

const configLocationPrec = [
  "chainlink.config.js",
  "chainlink/chainlink.config.js",
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

  const config = (await readTsFile(configFilePath))?.default

  const validateConfig = configSchema.safeParse(config)

  if (!validateConfig.success) {
    throw new Error(`Invalid schema: ${validateConfig.error.message}`)
  }

  return deepMerge<ChainlinkConfig>(defaultConfig, validateConfig.data)
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
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
