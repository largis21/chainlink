import { parse } from "@babel/parser";
import { isObjectExpression } from "@babel/types";
import { describe, expect, it } from "vitest";

import { getDefaultExportedObjectExpression } from "../get-default-exported-object-expression";

function doTest(file: string) {
  const ast = parse(file, {
    sourceType: "module",
  });

  const maybeObjectExpression = getDefaultExportedObjectExpression(ast);

  return isObjectExpression(maybeObjectExpression.node);
}

describe("can find an object expression on the default export", () => {
  it("NamedDefaultExportDeclaration - Identifier - CallExpression - ObjectExpression", () => {
    const file = `
      const config = defineRequest({
        method: "GET",
        url: "localhost"
      });

      export {
        config as default
      };`;

    expect(doTest(file)).toBe(true);
  });

  it("NamedDefaultExportDeclaration - Identifier - ObjectExpression", () => {
    const file = `
      const config = {
        method: "GET",
        url: "localhost"
      };

      export {
        config as default
      };`;

    expect(doTest(file)).toBe(true);
  });

  it("DefaultExportDeclaration - CallExpression - ObjectExpression", () => {
    const file = `
      export default defineRequest({
        method: "GET",
        url: "localhost"
      });`;

    expect(doTest(file)).toBe(true);
  });

  it("DefaultExportDeclaration - ObjectExpression", () => {
    const file = `
      export default {
        method: "GET",
        url: "localhost"
      };`;

    expect(doTest(file)).toBe(true);
  });

  it("DefaultExportDeclaration - Identifier - CallExpression - ObjectExpression", () => {
    const file = `
      const config = defineRequest({
        method: "GET",
        url: "localhost"
      });

      export default config;`;

    expect(doTest(file)).toBe(true);
  });

  it("DefaultExportDeclaration - Identifier - ObjectExpression", () => {
    const file = `
      const config = {
        method: "GET",
        url: "localhost"
      };

      export default config;`;

    expect(doTest(file)).toBe(true);
  });
});

describe("will throw when there is no object expression on the default export", () => {
  it("Empty file", () => {
    const file = "";

    expect(() => doTest(file)).toThrowError();
  });

  it("Invalid file", () => {
    const file = "export default 'Foo bar'";

    expect(() => doTest(file)).toThrowError();
  });
});
