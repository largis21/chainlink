import type { ChainlinkConfig } from "../config/define-config";
import path from "path";
import {
  type FsDirectory,
  readDirRecursive,
} from "../utils/read-dir-recursive";

export async function getChainsDir(
  config: ChainlinkConfig,
): Promise<FsDirectory> {
  const chainsDir = path.resolve(config.chainlinkRootDir, config.chainsDir);
  return await readDirRecursive(chainsDir);
}
