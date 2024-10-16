import { parse } from "@babel/parser";

import { generate } from "@/babel-import";
import { ReadTsFileResult } from "@/utils/read-ts-file";

import { getDefaultExportedObjectExpression } from "./get-default-exported-object-expression";
import { getPropertyNodePaths } from "./get-property-node-paths";

export async function getRequestDefinitionNodePaths(file: ReadTsFileResult) {
  if (!file?.text) {
    throw new Error("@TODO Create error text");
  }

  const ast = parse(file.text, {
    sourceType: "module",
  });

  const objectExpression = getDefaultExportedObjectExpression(ast);

  const nodePaths = getPropertyNodePaths(objectExpression);

  const stringifiedProperties = Object.keys(
    nodePaths,
    // You can type this properly if you want
  ).reduce<Record<string, string>>((acc, cur) => {
    if (!(cur in nodePaths)) {
      return acc;
    }

    acc[cur] = generate(nodePaths[cur as keyof typeof nodePaths]!.node).code;

    return acc;
  }, {});

  return {
    nodePaths,
    stringifiedProperties,
  };
}
