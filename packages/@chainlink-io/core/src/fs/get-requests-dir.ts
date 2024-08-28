import type { ChainlinkConfig } from "../config/define-config";
import path from "path";
import {
  type FsDirectory,
  readDirRecursive,
} from "../utils/read-dir-recursive";

export async function getRequestsDir(
  config: ChainlinkConfig,
): Promise<FsDirectory> {
  const requestsDir = path.resolve(config.chainlinkRootDir, config.requestsDir);
  return await readDirRecursive(requestsDir);
}
