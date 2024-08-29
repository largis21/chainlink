import fs from "fs/promises";
import path from "path";
import { ChainlinkConfig } from "../config/define-config";
import { readTsFile } from "../read-ts/read-ts-file";

export async function readFile(
  config: ChainlinkConfig,
  filePath: string,
): Promise<{
  text: string;
  exports: { default?: unknown;[key: string]: unknown };
} | null> {
  const resolvedFilePath = path.resolve(config.chainlinkRootDir, filePath);

  try {
    const file = await fs.readFile(resolvedFilePath);
    const exports = await readTsFile(resolvedFilePath);

    if (!exports) throw new Error();

    return {
      text: file.toString(),
      exports: exports,
    };
  } catch {
    return null;
  }
}
