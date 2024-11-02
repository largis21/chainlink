import { NodePath } from "@babel/traverse";
import { Identifier, isIdentifier, ObjectExpression } from "@babel/types";

export function getObjectExpressionProperty(
  nodePath: NodePath<ObjectExpression>,
  keyName: string,
): NodePath | null {
  const property = nodePath.get("properties").find((property) => {
    if (property.type !== "ObjectProperty") {
      throw new Error(
        `'${property.type}' is not supported in getObjectExpressionMember yet, pr is welcome`,
      );
    }

    const key = property.get("key") as NodePath;

    if (!isIdentifier(key.node)) {
      throw new Error(
        `'${property.type}' is not a supported key type in getObjectExpressionMember yet, pr is welcome`,
      );
    }

    const keyIdentifier = key as NodePath<Identifier>;

    if (keyIdentifier.node.name !== keyName) {
      return;
    }

    return true;
  });

  return (property as NodePath) || null;
}
