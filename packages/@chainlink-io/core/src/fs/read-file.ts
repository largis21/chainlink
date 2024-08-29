import fs from "fs/promises";
import path from "path";
import { ChainlinkConfig } from "../config/define-config";
import { readTsFile } from "../read-ts/read-ts-file";

export type ReadFileResult = {
  text: string;
  exports: { default?: unknown;[key: string]: unknown };
} | null;

export async function readFile(
  config: ChainlinkConfig,
  filePath: string,
): Promise<ReadFileResult> {
  const resolvedFilePath = path.resolve(config.chainlinkRootDir, filePath);

  console.log("READING", resolvedFilePath)

  // Only files inside of the chainlinkRoot should be readable through this function
  if (!resolvedFilePath.startsWith(config.chainlinkRootDir)) {
    return null
  }

  try {
    const file = await fs.readFile(resolvedFilePath);
    const exports = await readTsFile(resolvedFilePath);

    console.log("file", file)
    console.log("exports", exports)
    if (!exports) throw new Error();

    return {
      text: file.toString(),
      exports: exports,
    };
  } catch (e) {
    console.error(e)
    return null;
  }
}
