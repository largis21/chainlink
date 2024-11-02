import { parse } from "@babel/parser";

export function parseBundleToAst(bundle: string) {
  return parse(bundle, {
    sourceType: "module",
  });
}
