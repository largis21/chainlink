import {
  ChainlinkConfig,
  chainlinkRequestDefinitionSchema,
  ReadFileResult,
} from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";

import { ChainlinkContext } from "@/cl-context";

import { __readTsFile } from ".";

export type { ReadFileResult } from "@chainlink-io/types";

/**
 * Helper function to get a bunch of data from a typescript file
 *
 * Only allows reading from inside chainlinkDir, if filePath isn't inside chainlinkDir,
 * the final path will be relative to chainlinkDir
 */
export async function readFile(
  config: ChainlinkConfig,
  _filePath: string,
  options?: {
    clContext?: ChainlinkContext;
  },
): Promise<ReadFileResult> {
  let filePath = _filePath;

  if (!filePath.startsWith(config.chainlinkDir)) {
    filePath = path.resolve(path.join(config.chainlinkDir, _filePath));
  }

  const file = await fs.readFile(filePath);

  const { exports, text, sourceMap } = await __readTsFile(filePath, {
    config,
    clContext: options?.clContext,
  });

  if (!exports) throw new Error();

  const isRequestDef = !!chainlinkRequestDefinitionSchema.safeParse(
    exports.default,
  ).success;

  return {
    text: file.toString(),
    bundledText: text,
    exports,
    sourceMap,
    fileType: isRequestDef ? "requestDef" : undefined,
  };
}
