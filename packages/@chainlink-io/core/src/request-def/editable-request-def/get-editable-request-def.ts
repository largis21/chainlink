import { parse } from "@babel/parser";
import { ChainlinkConfig } from "@chainlink-io/types";

import { createClContext } from "@/cl-context";
import { readFile } from "@/utils";

import { getEditableProperties } from "./editable-properties";
import { getDefaultExportedObjectExpression } from "./get-default-exported-object-expression";

export async function getEditableRequestDefinition(
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

  const editableProperties = getEditableProperties(objectExpression);

  return {
    editableRequestDefinition: editableProperties,
    sourceMap: file.sourceMap,
  };
}
