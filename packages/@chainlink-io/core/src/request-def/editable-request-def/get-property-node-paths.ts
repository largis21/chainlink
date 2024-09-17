import { Node, NodePath } from "@babel/traverse";
import { isIdentifier, isObjectProperty, ObjectExpression } from "@babel/types";
import { ChainlinkRequestDefinition } from "@chainlink-io/types";

import { getNodeOrigin } from "./get-node-origin";

const requestDefPropertyASTNodeMap: Record<
  keyof ChainlinkRequestDefinition,
  Node["type"][]
> = {
  url: ["StringLiteral", "TemplateLiteral"],
  method: ["StringLiteral"],
  queryParams: ["ArrayExpression"],
};

export type PropertyNodePaths = {
  [K in keyof typeof requestDefPropertyASTNodeMap]: NodePath;
};

export function getPropertyNodePaths(
  objectExpression: NodePath<ObjectExpression>,
): Partial<PropertyNodePaths> {
  const properties = objectExpression.get("properties");

  const fields: Partial<PropertyNodePaths> =
    {} as unknown as Partial<PropertyNodePaths>;

  properties.forEach((property) => {
    if (
      isObjectProperty(property.node) &&
      isIdentifier(property.node.key) &&
      Object.keys(requestDefPropertyASTNodeMap).includes(property.node.key.name)
    ) {
      fields[property.node.key.name as keyof PropertyNodePaths] = getNodeOrigin(
        property.get("value") as NodePath,
        requestDefPropertyASTNodeMap[
        property.node.key.name as keyof PropertyNodePaths
        ],
      );
      return;
    }

    throw new Error(`'${property.node.type}' is not a supported propertyType`);
  });

  return fields;
}
