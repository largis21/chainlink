import { NodePath } from "@babel/traverse";
import { Node } from "@babel/types";

export type NodePathSelector = Record<`exports.${string}`, Array<Node["type"]>>;

export type NodePathResult<
  TSelector extends NodePathSelector = NodePathSelector,
> = {
    [K in keyof TSelector]: TSelector[K] extends Array<infer U>
    ? NodePath<U>
    : never;
  };

export function getNodePaths<TSelector extends NodePathSelector>(
  ast: Node,
  selector: TSelector,
): NodePathResult<TSelector> {
  for (const path of Object.keys(selector)) {
    if (!path.startsWith("exports.")) {
      throw new Error("TODO error");
    }

    const exportNode = getExportedNode;

    console.log(path);
  }
}
