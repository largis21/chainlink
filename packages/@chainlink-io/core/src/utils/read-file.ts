import { ChainlinkConfig, ReadFileResult } from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";

import { __evalTsFile } from "./eval-ts-file";

export type { ReadFileResult } from "@chainlink-io/types";

/**
 * Safe wrapper around __evalTsFile that prohibits reading files outside of chainlinkDir
 *
 * Only allows reading from inside chainlinkDir, if filePath isn't inside chainlinkDir,
 * the final path will be relative to chainlinkDir
 */
export async function readFile(
  config: ChainlinkConfig,
  _filePath: string,
): Promise<ReadFileResult> {
  let filePath = _filePath;

  if (!filePath.startsWith(config.chainlinkDir)) {
    filePath = path.resolve(path.join(config.chainlinkDir, _filePath));
  }

  const evalResult = await __evalTsFile(filePath, {
    config,
  });

  if (!evalResult.exports) throw new Error();

  return {
    originalText: await fs.readFile(filePath).then((buf) => buf.toString()),
    bundledText: evalResult.text,
    exports: evalResult.exports,
    sourceMap: evalResult.sourceMap,
  };
}
