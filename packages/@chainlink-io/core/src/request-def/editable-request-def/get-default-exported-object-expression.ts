import { NodePath } from "@babel/traverse";
import traverse from "@babel/traverse";
import {
  isIdentifier,
  isObjectExpression,
  Node,
  ObjectExpression,
} from "@babel/types";

import { getNodeOrigin } from "./get-node-origin";

export function getDefaultExportedObjectExpression(
  ast: Node,
): NodePath<ObjectExpression> {
  let defaultExportObjectExpression: NodePath | null =
    null as unknown as NodePath;

  traverse(ast, {
    ExportDefaultDeclaration: (path) => {
      defaultExportObjectExpression = getNodeOrigin(path);
    },
    ExportNamedDeclaration: (path) => {
      path.traverse({
        ExportSpecifier: (specifierPath) => {
          if (
            isIdentifier(specifierPath.node.exported) &&
            specifierPath.node.exported.name === "default"
          ) {
            defaultExportObjectExpression = getNodeOrigin(
              specifierPath.get("local"),
            );
          }
        },
      });
    },
  });

  if (!defaultExportObjectExpression) {
    throw new Error("No default export");
  }

  if (!isObjectExpression(defaultExportObjectExpression.node)) {
    throw new Error("Default export is not an ObjectExpression");
  }

  return defaultExportObjectExpression as NodePath<ObjectExpression>;
}
