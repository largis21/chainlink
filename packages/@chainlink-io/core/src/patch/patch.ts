import { Node } from "@babel/types";

export type GenericPatch<T extends string = string> = {
  /**
   * A patch is applied from an ObjectExpression, for example the first argument to defineRequest
   *
   * @todo
   * Currently, only properties of the root ObjectExpression are supported
   */
  path: T;

  /**
   * This will be the node the patch is applied to
   *
   * @example ["TemplateLiteral", "StringLiteral"]
   */
  nodeTypes: Node["type"][];

  /**
   * Stringifed new value
   */
  value: string;
};
