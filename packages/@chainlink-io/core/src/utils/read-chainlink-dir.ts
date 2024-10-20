import {
  type ChainlinkConfig,
  chainlinkRequestDefinitionSchema,
  type ReadChainlinkDirResult,
} from "@chainlink-io/types";
import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";

import { readFile } from "./read-file";

export async function readChainlinkDir(
  config: ChainlinkConfig,
): Promise<ReadChainlinkDirResult> {
  const filePaths = await fg(`${config.chainlinkDir}/**/*`, {
    onlyFiles: false,
  }).then((result) => result.filter((e) => !e.includes("__chainlink_temp")));

  const fileResults: ReadChainlinkDirResult = [];

  for (const filePath of filePaths) {
    const fileInfo = await getFileInfo(config, filePath);
    if (!fileInfo) continue;
    fileResults.push(fileInfo);
  }

  // Doing this in parallel is much faster but if reading a file throws an error, it will stop execution
  // of other reads before it can remove its temp directories
  // const fileResults = await Promise.all(
  //   filePaths.map((filePath) => getFileInfo(config, filePath)),
  // ).then((result) =>
  //   result.filter(
  //     (file): file is ReadChainlinkDirResult[number] => file !== null,
  //   ),
  // );

  return fileResults;
}

async function getFileInfo(
  config: ChainlinkConfig,
  filePath: string,
): Promise<ReadChainlinkDirResult[number] | null> {
  const publicFilePath = path.relative(config.chainlinkDir, filePath);

  const stat = await fs.stat(filePath);

  if (stat.isDirectory()) {
    return {
      path: publicFilePath,
      type: "dir",
    };
  }

  if (!stat.isFile()) {
    console.warn(`Could not read file '${publicFilePath}'`);
    return null;
  }

  const file = await readFile(config, filePath);

  if (!file) {
    console.warn(`Could not read file '${publicFilePath}'`);
    return null;
  }

  const requestDef = chainlinkRequestDefinitionSchema.safeParse(
    file.exports.default,
  );
  if (requestDef.success) {
    return {
      path: publicFilePath,
      type: "requestDef",
      data: requestDef.data.method,
    };
  }
  console.error("Chain definitions are not supported YET");
  return null;
}
