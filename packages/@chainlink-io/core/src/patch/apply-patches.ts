import { NodePath } from "@babel/traverse";
import { ObjectExpression, SourceLocation } from "@babel/types";
import { ReadFileResult } from "@chainlink-io/types";
import fs from "fs/promises";
import path from "path";
import { print, parse, types, visit, Transformer } from "recast";
import sourceMap, { MappedPosition } from "source-map";

import { getNodeOrigin } from "@/ast-helpers/get-node-origin";
import { getObjectExpressionProperty } from "@/ast-helpers/get-object-expression-property";

import { GenericPatch } from "./patch";

export async function applyPatches(
  file: ReadFileResult,
  filePath: string,
  rootNode: NodePath<ObjectExpression>,
  patches: GenericPatch[],
) {
  patches.forEach(async (patch) => {
    const objectProperty = getObjectExpressionProperty(rootNode, patch.path);

    if (!objectProperty) {
      throw new Error(
        "Missing feature - In this case, create a ObjectProperty with the value inline",
      );
    }

    const objectPropertyValue = objectProperty.get("value") as NodePath;

    const propertyValueNodeOrigin = getNodeOrigin(
      objectPropertyValue,
      patch.nodeTypes,
    );

    const nodeLoc = propertyValueNodeOrigin.node.loc;

    if (!nodeLoc) {
      throw new Error("No loc on node");
    }

    const sourceLoc = await getSourceLoc(file.sourceMap, nodeLoc);
    // The sourceLoc also returns which file the sourceNode is in, we read that file and parse it with
    // recast
    // When changing sourcefiles, we use recast, as it can preserve the formatting in the file
    const fileContents = (
      await fs.readFile(path.resolve(filePath, sourceLoc.source))
    ).toString();

    const sourceCodeAst = await parse(fileContents, {
      parser: await import("recast/parsers/typescript.js"),
    });

    const sourceNode = getSourceNode(sourceCodeAst, sourceLoc);

    const patchValueAst = parse(`const value = ${patch.value}`);
    const patchValueNode = patchValueAst.program.body[0].declarations[0].init;

    Object.assign(sourceNode, patchValueNode);

    console.log(print(sourceCodeAst).code);
  });

  return rootNode;
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

function getSourceNode(
  ast: types.ASTNode,
  sourceLoc: MappedPosition,
): types.namedTypes.Node {
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
