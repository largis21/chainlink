import { Node, NodePath } from "@babel/traverse";
import {
  Identifier,
  isArrayExpression,
  isCallExpression,
  isIdentifier,
  isMemberExpression,
  isNumericLiteral,
  isObjectExpression,
  isStringLiteral,
  isVariableDeclarator,
  StringLiteral,
} from "@babel/types";

/**
 * This will recursivly traverse the ast until it finds the node you are looking for
 * It requires that the code is staticly analyzable
 */
export function getNodeOrigin<T extends Node["type"][]>(
  nodePath: NodePath,
  type: T,
): NodePath<Extract<Node, { type: T[number] }>> {
  if (type.includes(nodePath.node.type)) {
    // This typechecking in this file is already pretty slow, casting it to any is easiest and should
    // be safe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return nodePath as any;
  }

  if (isIdentifier(nodePath.node)) {
    const binding = nodePath.scope.getBinding(nodePath.node.name);

    if (binding && binding.path) {
      return getNodeOrigin(binding.path, type);
    }

    throw new Error(`Could not resolve identifier: '${nodePath.node.name}'`);
  }

  if (isVariableDeclarator(nodePath.node)) {
    return getNodeOrigin(nodePath.get("init") as NodePath, type);
  }

  // We support callExpression only if it's callee is the `defineRequest` helper function
  // We then use its first argument, as that will be the actual declaration
  if (
    isCallExpression(nodePath.node) &&
    isIdentifier(nodePath.node.callee) &&
    nodePath.node.callee.name === "defineRequest"
  ) {
    const firstArg = nodePath.get("arguments.0") as NodePath;

    if (isObjectExpression(firstArg.node)) {
      return getNodeOrigin(firstArg, type);
    }

    throw new Error(
      `Invalid nodetype '${firstArg.type}' as first argument to 'defineRequest'`,
    );
  }

  if (isMemberExpression(nodePath.node)) {
    const objectSource = getNodeOrigin(nodePath.get("object") as NodePath, [
      "ArrayExpression",
      "ObjectExpression",
    ]);

    // Computed means that the identifier should be resolved and not used as a propertyname
    // obj.ident - `computed` will be `false` - gets the property `ident`
    // const ident = "hello"
    // obj[ident] - `computed` will be `trye` - computes the value, resolves to `hello`, gets the
    //   property `hello`
    const propertySource = nodePath.node.computed
      ? getNodeOrigin(nodePath.get("property") as NodePath, [
        "NumericLiteral",
        "StringLiteral",
      ])
      : (nodePath.get("property") as NodePath<Identifier>);

    if (isArrayExpression(objectSource.node)) {
      if (isNumericLiteral(propertySource.node)) {
        const element = objectSource.get(
          `elements.${propertySource.node.value}`,
        );

        if (!element) {
          throw new Error(
            `Index '${propertySource.node.value}' is probably out of range`,
          );
        }

        return getNodeOrigin(element as NodePath, type);
      }

      throw new Error(
        `'${propertySource.node.type}' cannot be used to index an ArrayExpression`,
      );
    }

    if (isObjectExpression(objectSource.node)) {
      const properties = objectSource.get("properties") as NodePath;

      if (isIdentifier(propertySource.node)) {
        const objectProperty: NodePath | null = properties.find((e) => {
          if (
            e.isObjectProperty() &&
            isIdentifier(e.node.key) &&
            e.node.key.name === (propertySource.node as Identifier).name
          )
            return true;

          return false;
        });

        if (!objectProperty) {
          throw new Error(
            `'${propertySource.node.name}' cannot be used to index ObjectExpression`,
          );
        }

        return getNodeOrigin(objectProperty.get("value") as NodePath, type);
      }

      if (isStringLiteral(propertySource.node)) {
        const objectProperty: NodePath | null = properties.find((e) => {
          if (
            e.isObjectProperty() &&
            isIdentifier(e.node.key) &&
            e.node.key.name === (propertySource.node as StringLiteral).value
          )
            return true;

          return false;
        });

        if (!objectProperty) {
          throw new Error(
            `'${propertySource.node.value}' cannot be used to index ObjectExpression`,
          );
        }

        return getNodeOrigin(objectProperty.get("value") as NodePath, type);
      }

      throw new Error(
        `'${propertySource.node.type}' cannot be used to index an ObjectExpression`,
      );
    }

    throw new Error(
      `Unsupported MemberExpression object: '${(objectSource.node as Node).type}'`,
    );
  }

  throw new Error(`Unsupported nodetype: '${nodePath.node.type}'`);
}
