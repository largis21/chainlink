import { parse } from "@babel/parser";
import { createClContext } from "@/cl-context";
import { readFile } from "@/utils";
import { ChainlinkConfig } from "@/config";
import { getDefaultExportedObjectExpression } from "./get-default-exported-object-expression";
import { getEditableProperties } from "./editable-properties";

const withDefaultExportDeclarationWithCaller = `
const defaultMethod = "GET"

export default defineRequest({
  method: defaultMethod,
  url: "nothing"
});
`;

const withDefaultExportDeclarationWithIdent = `
const defaultMethod = "GET"

const config = defineRequest({
  method: defaultMethod,
  url: "nothing"
})

export default config
`;

const withNamedDefaultExportDeclaration = `
const defaultMethod = "GET"

const config = defineRequest({
  method: defaultMethod,
  url: "nothing"
})

export {
  config as default
}
`;

const tests = {
  1: withDefaultExportDeclarationWithCaller,
  2: withDefaultExportDeclarationWithIdent,
  3: withNamedDefaultExportDeclaration,
}

export async function getEditableRequestDefinition(
  config: ChainlinkConfig,
  filePath: string,
) {
  const file = await readFile(config, filePath, {
    clContext: createClContext(config),
  });

  if (!file?.bundledText) {
    throw new Error("@TODO Create error text");
  }

  const ast = parse(file.bundledText, {
    sourceType: "module",
  });

  const objectExpression = getDefaultExportedObjectExpression(ast)

  const editableProperties = getEditableProperties(objectExpression)

  return {
    editableRequestDefinition: editableProperties,
    sourceMap: file.sourceMap,
  }
}

