import { parse } from "@babel/parser";
import { Node, NodePath } from "@babel/traverse";
import { isIdentifier } from "@babel/types";
import { describe, expect, it } from "vitest";

import { traverse } from "@/babel";

import { getNodeOrigin } from "../get-node-origin";

function doTest(file: string, type: Node["type"]) {
  const ast = parse(file, {
    sourceType: "module",
  });

  let nodePath: NodePath | null = null;

  traverse(ast, {
    VariableDeclarator: (path) => {
      if (!isIdentifier(path.node.id)) return;
      if (path.node.id.name !== "test") return;
      nodePath = path.get("init") as NodePath;
    },
  });

  if (!nodePath) throw new Error("Invalid test");

  const maybeCorrectNodePath = getNodeOrigin(nodePath, [type]);

  return maybeCorrectNodePath.node.type === type;
}

describe("should get the origin of a node", () => {
  it("finds origin when declaration is ObjectExpression", () => {
    const file = `
      const test = {}
    `;
    expect(doTest(file, "ObjectExpression")).toBe(true);
  });

  it("finds origin when declaration is identifier", () => {
    const file = `
      const expr = {}
      const test = expr
    `;
    expect(doTest(file, "ObjectExpression")).toBe(true);
  });

  it("finds origin through MemberExpression - ArrayExpression", () => {
    const file = `
      const values = ["1", 2, "3"]

      const test = values[1]
    `;
    expect(doTest(file, "NumericLiteral")).toBe(true);
  });

  it("finds origin through MemberExpression with identifier - ObjectExpression", () => {
    const file = `
      const values = {
        value1: 1,
        value2: "2",
        value3: 3,
      }

      const test = values.value2
    `;
    expect(doTest(file, "StringLiteral")).toBe(true);
  });

  it("finds origin through MemberExpression with identifier - ObjectExpression with identifier", () => {
    const file = `
      const valueToGet = "2"

      const values = {
        value1: 1,
        value2: valueToGet,
        value3: 3,
      }

      const test = values.value2
    `;
    expect(doTest(file, "StringLiteral")).toBe(true);
  });

  it("finds origin through MemberExpression with StringLiteral - ObjectExpression with identifier", () => {
    const file = `
      const valueToGet = "2"

      const values = {
        value1: 1,
        value2: valueToGet,
        value3: 3,
      }

      const test = values["value2"]
    `;
    expect(doTest(file, "StringLiteral")).toBe(true);
  });

  it("finds origin through MemberExpression with Identifier resolving to StringLiteral - ObjectExpression with identifier", () => {
    const file = `
      const valueToGet = "2"

      const values = {
        value1: 1,
        value2: valueToGet,
        value3: 3,
      }

      const indexValue = "value2"

      const test = values[indexValue]
    `;
    expect(doTest(file, "StringLiteral")).toBe(true);
  });

  it("fails when origin when is not a StringLiteral", () => {
    const file = `
      const test = {}
    `;
    expect(() => doTest(file, "StringLiteral")).toThrowError();
  });
});
