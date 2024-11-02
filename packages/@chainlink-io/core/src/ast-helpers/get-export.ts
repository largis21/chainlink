import { NodePath } from "@babel/traverse";
import { isIdentifier, Node } from "@babel/types";

import { traverse } from "@/babel";

export function getExport(ast: Node, name: string): NodePath {
  let exportedNode: NodePath | null = null as unknown as NodePath;

  traverse(ast, {
    ExportDefaultDeclaration: (path) => {
      if (name !== "default") return;
      exportedNode = path.get("value") as NodePath;
    },
    ExportNamedDeclaration: (path) => {
      path.traverse({
        ExportSpecifier: (specifierPath) => {
          if (
            isIdentifier(specifierPath.node.exported) &&
            specifierPath.node.exported.name === name
          ) {
            exportedNode = specifierPath.get("local");
          }
        },
      });
    },
  });

  if (!exportedNode) {
    throw new Error(`No export with name: '${name}'`);
  }

  return exportedNode as NodePath;
}
