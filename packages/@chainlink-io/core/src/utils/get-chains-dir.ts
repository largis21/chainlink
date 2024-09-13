import path from "path";

import type { ChainlinkConfig } from "@/config";

import { type FsDirectory, readDirRecursive } from ".";

export async function getChainsDir(
  config: ChainlinkConfig,
): Promise<FsDirectory> {
  const chainsDir = path.resolve(config.chainlinkRootDir, config.chainsDir);
  return await readDirRecursive(chainsDir);
}
