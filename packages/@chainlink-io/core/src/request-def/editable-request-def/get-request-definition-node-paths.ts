import { parse } from "@babel/parser";
import { ChainlinkConfig } from "@chainlink-io/types";

import { createClContext } from "@/cl-context";
import { readFile } from "@/utils";

import { getDefaultExportedObjectExpression } from "./get-default-exported-object-expression";
import { getPropertyNodePaths } from "./get-property-node-paths";

export async function getRequestDefinitionNodePaths(
  config: ChainlinkConfig,
  filePath: string,
) {
  const file = await readFile(config, filePath, {
    clContext: createClContext(config),
  });

  if (!file?.bundledText) {
    throw new Error("@TODO Create error text");
  }

  const ast = parse(file.bundledText, {
    sourceType: "module",
  });

  const objectExpression = getDefaultExportedObjectExpression(ast);

  const nodePaths = getPropertyNodePaths(objectExpression);

  return {
    requestDefinitionNodePaths: nodePaths,
    sourceMap: file.sourceMap,
  };
}
