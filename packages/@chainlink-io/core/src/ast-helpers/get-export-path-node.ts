import { Node, ObjectExpression } from "@babel/types";

import { getExport } from "./get-export";
import { NodePath } from "@babel/traverse";
import { getObjectExpressionProperty } from "./get-object-expression-property";
import { getNodeOrigin } from "./get-node-origin";

export function getExportPathNode(ast: Node, exportPath: string) {
  const pathParts = exportPath.split(".");

  if (!pathParts.length) {
    throw new Error("An exportPath must have a length of atleast 1");
  }

  const exportNode = getExport(ast, pathParts[0]);
  const exportNodeOrigin = getNodeOrigin(exportNode, ["ObjectExpression"]);

  let currentNode: NodePath<ObjectExpression> = exportNodeOrigin;

  pathParts.splice(0, 1);

  while (pathParts.length) {
    const memberNode = getObjectExpressionProperty(currentNode, pathParts[0]);

    if (!memberNode) {
      throw new Error(
        `Property '${pathParts[0]}' doesn't exist on ObjectExpression`,
      );
    }

    const memberOrigin = getNodeOrigin(memberNode, ["ObjectExpression"]);

    currentNode = memberOrigin;
    pathParts.splice(0, 1);
  }

  return currentNode;
}
