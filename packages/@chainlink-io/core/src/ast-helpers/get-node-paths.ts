import { Node } from "@babel/types";

export type NodePathSelector = {
  [K: `exports.${string}`]: Node["type"][];
};

const a: NodePathSelector = {
  "exports.default": ["TemplateElement"],
};
