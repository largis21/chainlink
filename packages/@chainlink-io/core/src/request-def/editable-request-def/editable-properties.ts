import { NodePath } from "@babel/traverse";
import { isIdentifier, isObjectProperty, ObjectExpression } from "@babel/types";

import { ChainlinkRequestDefinition } from "..";
import { getNodeOrigin } from "./get-node-origin";

// const requestDefPropertyASTNodeMap = {
//   url: "StringLiteral",
//   method: "StringLiteral",
//   queryParams: "ObjectExpression"
// };

// @TODO
// eslint-disable-next-line
const editableProperty = [
  "url",
  "method",
  "queryParams",
] satisfies (keyof ChainlinkRequestDefinition)[];

type EditableProperty = (typeof editableProperty)[number];

export type EditableRequestDefinition = {
  [K in EditableProperty]: NodePath;
};

export function getEditableProperties(
  objectExpression: NodePath<ObjectExpression>,
) {
  const properties = objectExpression.get("properties");

  const fields: EditableRequestDefinition =
    {} as unknown as EditableRequestDefinition;

  properties.forEach((property) => {
    if (isObjectProperty(property.node) && isIdentifier(property.node.key)) {
      fields[property.node.key.name as (typeof editableProperty)[number]] =
        getNodeOrigin(property.get("value") as NodePath);
      return;
    }

    throw new Error(`'${property.node.type}' is not a supported propertyType`);
  });

  return fields;
}
