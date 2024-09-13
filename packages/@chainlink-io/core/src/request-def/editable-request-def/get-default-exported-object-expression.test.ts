import { parse } from "@babel/parser";
import { isObjectExpression } from "@babel/types";
import { expect, test } from "vitest";

import { getDefaultExportedObjectExpression } from "./get-default-exported-object-expression";

const suiteNamePositive = "can find an object expression on the default export";
const suiteNameNegative =
  "will throw when there is no object expression on the default export";

function doTest(file: string) {
  const ast = parse(file, {
    sourceType: "module",
  });

  const maybeObjectExpression = getDefaultExportedObjectExpression(ast);

  return isObjectExpression(maybeObjectExpression.node);
}

test(`${suiteNamePositive} - NamedDefaultExportDeclaration - Identifier - CallExpression - ObjectExpression`, () => {
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

test(`${suiteNamePositive} - NamedDefaultExportDeclaration - Identifier - ObjectExpression`, () => {
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

test(`${suiteNamePositive} - DefaultExportDeclaration - CallExpression - ObjectExpression`, () => {
  const file = `
    export default defineRequest({
      method: "GET",
      url: "localhost"
    });`;

  expect(doTest(file)).toBe(true);
});

test(`${suiteNamePositive} - DefaultExportDeclaration - ObjectExpression`, () => {
  const file = `
    export default {
      method: "GET",
      url: "localhost"
    };`;

  expect(doTest(file)).toBe(true);
});

test(`${suiteNamePositive} - DefaultExportDeclaration - Identifier - CallExpression - ObjectExpression`, () => {
  const file = `
    const config = defineRequest({
      method: "GET",
      url: "localhost"
    });

    export default config;`;

  expect(doTest(file)).toBe(true);
});

test(`${suiteNamePositive} - DefaultExportDeclaration - Identifier - ObjectExpression`, () => {
  const file = `
    const config = {
      method: "GET",
      url: "localhost"
    };

    export default config;`;

  expect(doTest(file)).toBe(true);
});

test(`${suiteNameNegative} - Empty file`, () => {
  const file = "";

  expect(() => doTest(file)).toThrowError();
});

test(`${suiteNameNegative} - Invalid file`, () => {
  const file = "export default 'Foo bar'";

  expect(() => doTest(file)).toThrowError();
});
