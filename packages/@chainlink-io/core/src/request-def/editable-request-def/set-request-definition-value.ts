import { SourceLocation } from "@babel/types";
import { ChainlinkConfig } from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";
import { parse, print, types, visit } from "recast";
import sourceMap, { MappedPosition } from "source-map";

import { ChainlinkRequestDefinition } from "..";
import { EditableRequestDefinition } from "./editable-properties";
import { getEditableRequestDefinition } from "./get-editable-request-def";

export async function setRequestDefinitionValue<
  K extends keyof EditableRequestDefinition,
>(
  config: ChainlinkConfig,
  filePath: string,
  propertyToChange: K,
  newValue: ChainlinkRequestDefinition[K],
) {
  // This returns an object, with the same keys as ChainlinkRequestDefinition
  // But their value is the NodePath to where the value is actually defined
  // It also returns the sourceMap
  const { editableRequestDefinition, sourceMap } =
    await getEditableRequestDefinition(config, filePath);

  const nodePath = editableRequestDefinition[propertyToChange];
  if (!nodePath.node.loc) {
    throw new Error(
      "Missing loc for node, impossible to get original position in sourcecode",
    );
  }

  // Use the sourcemap so we can map the location of the node in the bundle, to the location of the
  // node in the sourcecode
  const sourceLoc = await getSourceLoc(sourceMap, nodePath.node.loc);

  // The sourceLoc also returns which file the sourceNode is in, we read that file and parse it with
  // recast
  // When changing sourcefiles, we use recast, as it can preserve the formatting in the file
  const fileContents = (
    await fs.readFile(path.resolve(filePath, sourceLoc.source))
  ).toString();
  const sourceCodeAst = await parse(fileContents, {
    parser: await import("recast/parsers/typescript.js"),
  });

  // Use the AST recast generated, and find a node that starts on the same line and column as
  // the location we got from the sourceMap
  const sourceNode = await getSourceNode(sourceCodeAst, sourceLoc);

  if (sourceNode.type === "StringLiteral") {
    // @TODO, when this prints, it still doesn't preserve the correct quote
    const literalNode = sourceNode as types.namedTypes.StringLiteral;
    const quoteToUse = literalNode.extra?.raw[0] || '"';

    const newStringLiteralValue: types.namedTypes.StringLiteral = {
      type: "StringLiteral",
      value: newValue as string,
      extra: {
        raw: `${quoteToUse}${newValue as string}${quoteToUse}`,
        rawValue: newValue as string,
      },
    };

    Object.assign(sourceNode, newStringLiteralValue);

    console.log(print(sourceCodeAst).code);

    return;
  }

  throw new Error(`Unsupported nodeType: '${sourceNode.type}'`);
}

async function getSourceLoc(
  bundleSourceMap: string,
  locToGet: SourceLocation,
): Promise<MappedPosition> {
  const consumer = await new sourceMap.SourceMapConsumer(bundleSourceMap);

  const originalStart = consumer.originalPositionFor({
    line: locToGet.start.line,
    column: locToGet.start.column,
  });

  if (
    !originalStart?.source ||
    !originalStart?.line ||
    !originalStart?.column
  ) {
    throw new Error(`Could not find ${locToGet.identifierName} in source file`);
  }

  // Cast safe because it is checked aboce
  return originalStart as MappedPosition;
}

async function getSourceNode(
  ast: types.ASTNode,
  sourceLoc: MappedPosition,
): Promise<types.namedTypes.Node> {
  let node: types.ASTNode | null = null;

  visit(ast, {
    visitNode(path) {
      const start = path.node.loc?.start;

      if (
        start?.line === sourceLoc.line &&
        start?.column === sourceLoc.column
      ) {
        node = path.node;
        return false;
      }

      return this.traverse(path);
    },
  });

  if (!node) {
    throw new Error(
      `Could not find node at line: '${sourceLoc.line}', column: ${sourceLoc.column}`,
    );
  }

  return node;
}
