import path from "path";

import type { ChainlinkConfig } from "@/config";

import { type FsDirectory, readDirRecursive } from ".";

export async function getRequestsDir(
  config: ChainlinkConfig,
): Promise<FsDirectory> {
  const requestsDir = path.resolve(config.chainlinkRootDir, config.requestsDir);
  return await readDirRecursive(requestsDir);
}
