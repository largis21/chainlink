import {
  ChainlinkConfig,
  chainlinkRequestDefinitionSchema,
  ReadFileResult,
} from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";

import { ChainlinkContext } from "@/cl-context";

import { getRequestDefinitionNodePaths } from "@/request-def/editable-request-def/get-request-definition-node-paths";
import { __evalTsFile } from "./eval-ts-file";

export type { ReadFileResult } from "@chainlink-io/types";

const propertyNodePaths = [{
  "exports.default.url": ["TemplateLiteral", "StringLiteral"]
}]

/**
 * Helper function to get a bunch of data from a typescript file
 *
 * Only allows reading from inside chainlinkDir, if filePath isn't inside chainlinkDir,
 * the final path will be relative to chainlinkDir
 */
export async function readFile<TNodePaths extends NodePathSelector>(
  config: ChainlinkConfig,
  _filePath: string,
  options?: {
    clContext?: ChainlinkContext;
    nodePaths?:
  },
): Promise<ReadFileResult> {
  let filePath = _filePath;

  if (!filePath.startsWith(config.chainlinkDir)) {
    filePath = path.resolve(path.join(config.chainlinkDir, _filePath));
  }

  const file = await fs.readFile(filePath);

  const evalResult = await __evalTsFile(filePath, {
    config,
  });

  if (!evalResult.exports) throw new Error();

  const isRequestDef = !!chainlinkRequestDefinitionSchema.safeParse(
    evalResult.exports.default,
  ).success;

  return {
    text: file.toString(),
    evaluated: {
      bundledText: evalResult.text,
      exports: evalResult.exports,
      sourceMap: evalResult.sourceMap,
    },
    meta: {
      fileType: isRequestDef ? "requestDef" : undefined,
    },
    propertySources: isRequestDef
      ? await getRequestDefinitionNodePaths(evalResult)
      : undefined,
  };
}
