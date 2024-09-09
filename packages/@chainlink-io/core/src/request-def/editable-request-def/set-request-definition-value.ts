import { ChainlinkConfig } from "@/config";
import { ChainlinkRequestDefinition } from "..";
import { EditableRequestDefinition } from "./editable-properties";
import { getEditableRequestDefinition } from "./get-editable-request-def";
import sourceMap, { MappedPosition } from "source-map";
import { parse, } from "recast/parsers/typescript.js";
import { print, visit, types } from "recast";
import path from "path";
import fs from "fs/promises";
import { SourceLocation } from "@babel/types";

// this function will read the request, with getDefaultExportedObjectExpression
// Find the node that the property evaluates to and read it's location
// Map that location to the location in the source files
// Change that value to the newValue
export async function setRequestDefinitionValue<
  K extends keyof EditableRequestDefinition,
>(
  config: ChainlinkConfig,
  filePath: string,
  propertyToChange: K,
  newValue: ChainlinkRequestDefinition[K],
) {
  const { editableRequestDefinition, sourceMap: bundleSourceMap } =
    await getEditableRequestDefinition(config, filePath);

  const nodePath = editableRequestDefinition[propertyToChange];
  if (!nodePath.node.loc) {
    throw new Error(
      "Missing loc for node, impossible to get original position in sourcecode",
    );
  }

  const sourceLoc = await getSourceLoc(bundleSourceMap, nodePath.node.loc);

  const fileContents = (await fs.readFile(path.resolve(filePath, sourceLoc.source))).toString();
  // When parsing sourcecode we use recast, because it can print the code with the same formatting
  // as it was parsed with
  const sourceCodeAst = parse(fileContents);

  const sourceNode = await getSourceNode(sourceCodeAst, sourceLoc)

  if (sourceNode.type === "StringLiteral") {
    const literalNode = (sourceNode as types.namedTypes.StringLiteral)
    const quoteToUse = literalNode.extra?.raw[0] || ""

    const newStringLiteralValue: types.namedTypes.StringLiteral = {
      type: "StringLiteral",
      value: newValue as string,
      extra: {
        raw: `${quoteToUse}${newValue as string}${quoteToUse}`,
        rawValue: newValue as string,
      },
    }

    Object.assign(sourceNode, newStringLiteralValue)

    console.log(print(sourceCodeAst))

    return
  }


  throw new Error(`Unsupported nodeType: '${sourceNode.type}'`)
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
  return originalStart as MappedPosition
}

async function getSourceNode(ast: types.ASTNode, sourceLoc: MappedPosition): Promise<types.namedTypes.Node> {
  let node: types.ASTNode | null = null

  visit(ast, {
    visitNode(path) {
      const { start } = path.node.loc!;

      if (
        start.line === sourceLoc.line &&
        start.column === sourceLoc.column
      ) {
        node = path.node
        return false;
      }

      return this.traverse(path);
    },
  });

  if (!node) {
    throw new Error(`Could not find node at line: '${sourceLoc.line}', column: ${sourceLoc.column}`)
  }

  return node
}
