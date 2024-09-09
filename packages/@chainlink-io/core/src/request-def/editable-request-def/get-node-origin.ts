import { NodePath } from "@babel/traverse";
import { isCallExpression, isExportDefaultDeclaration, isIdentifier, isLiteral, isObjectExpression, isVariableDeclarator } from "@babel/types";

/**
 * This will recursivly traverse the ast until it finds a literal or ObjectExpression
 */
export function getNodeOrigin(nodePath: NodePath): NodePath {
  if (isLiteral(nodePath.node)) {
    return nodePath;
  }

  if (isObjectExpression(nodePath.node)) {
    return nodePath;
  }

  if (isIdentifier(nodePath.node)) {
    const binding = nodePath.scope.getBinding(nodePath.node.name);

    if (binding && binding.path) {
      return getNodeOrigin(binding.path);
    }

    throw new Error(`Could not resolve identifier: '${nodePath.node.name}'`);
  }

  if (
    isVariableDeclarator(nodePath.node)
  ) {
    return getNodeOrigin(nodePath.get("init") as NodePath)
  }

  if (
    isCallExpression(nodePath.node) &&
    isIdentifier(nodePath.node.callee) &&
    nodePath.node.callee.name === "defineRequest"
  ) {
    const firstArg = nodePath.get("arguments.0") as NodePath;

    if (isObjectExpression(firstArg.node)) {
      return getNodeOrigin(firstArg);
    }

    throw new Error(
      `Invalid nodetype '${firstArg.type}' as first argument to 'defineRequest'`,
    );
  }

  if (isExportDefaultDeclaration(nodePath.node)) {
    return getNodeOrigin(nodePath.get("declaration") as NodePath);
  }

  throw new Error(`Unhandled nodetype: '${nodePath.node.type}'`);
}
