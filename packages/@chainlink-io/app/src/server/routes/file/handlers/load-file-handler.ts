import { NodePath } from "@babel/traverse";
import {
  getExport,
  getNodeOrigin,
  getObjectExpressionProperty,
  parseBundleToAst,
  readFile,
} from "@chainlink-io/core";
import { ChainlinkConfig } from "@chainlink-io/types";
import { BlankInput, Handler, HandlerResponse } from "hono/types";

import { generate } from "@/babel";
import { HonoAny } from "@/server/hono-type-helpers";
import {
  ErrorBaseApiResult,
  WithBaseApiResult,
} from "@/server/schemas/base-api-result";

import { LoadFileResponse } from "./load-file-response-schema";

export function getLoadFileHandler(
  config: ChainlinkConfig,
): Handler<HonoAny, HonoAny, BlankInput, HandlerResponse<LoadFileResponse>> {
  return async (c) => {
    const filePath = c.req.query("filePath");

    if (!filePath) {
      return c.json<ErrorBaseApiResult>(
        {
          success: false,
          error: "Bad request",
        },
        {
          status: 400,
        },
      );
    }

    try {
      const readFileResult = await readFile(config, filePath);

      const ast = parseBundleToAst(readFileResult.bundledText);

      const exportDeclaration = getExport(ast, "default");
      const exportedObject = getNodeOrigin(exportDeclaration, [
        "ObjectExpression",
      ]);

      const urlObjectProperty = getObjectExpressionProperty(
        exportedObject,
        "url",
      )?.get("value") as NodePath;
      if (!urlObjectProperty) throw new Error("TODO");
      const urlOrigin = getNodeOrigin(urlObjectProperty, [
        "StringLiteral",
        "TemplateLiteral",
      ]);

      const queryParamsObjectProperty = getObjectExpressionProperty(
        exportedObject,
        "queryParams",
      )?.get("value") as NodePath;
      const queryParamsOrigin = getNodeOrigin(queryParamsObjectProperty, [
        "ArrayExpression",
      ]);

      const stringifiedPropertySources = {
        url: generate(urlOrigin.node).code,
        queryParams: generate(queryParamsOrigin.node).code,
      };

      return c.json<WithBaseApiResult<LoadFileResponse>>({
        success: true,
        data: {
          ...(await readFile(config, filePath)),
          stringifiedPropertySources,
        },
      });
    } catch (e) {
      console.error(e);
      return c.json<ErrorBaseApiResult>(
        {
          success: false,
          error: "Internal server error",
        },
        { status: 500 },
      );
    }
  };
}
