import { ChainlinkConfig } from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";

import { ChainlinkContext } from "@/cl-context";

import { __readTsFile } from ".";

export type ReadFileResult = {
  text: string;
  bundledText: string;
  exports: { default?: unknown;[key: string]: unknown };
  sourceMap: string;
} | null;

export async function readFile(
  config: ChainlinkConfig,
  filePath: string,
  options?: {
    clContext?: ChainlinkContext;
  },
): Promise<ReadFileResult> {
  const resolvedFilePath = path.resolve(config.chainlinkRootDir, filePath);
  console.log("resolved", resolvedFilePath);

  // Only files inside of the chainlinkRoot should be readable through this function
  if (!resolvedFilePath.startsWith(config.chainlinkRootDir)) {
    throw new Error("Cannot read files outside of 'chainlinkRootDir'");
  }

  try {
    const file = await fs.readFile(resolvedFilePath);
    const { exports, text, sourceMap } = await __readTsFile(resolvedFilePath, {
      config,
      clContext: options?.clContext,
    });

    if (!exports) throw new Error();

    return {
      text: file.toString(),
      bundledText: text,
      exports: exports,
      sourceMap,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
