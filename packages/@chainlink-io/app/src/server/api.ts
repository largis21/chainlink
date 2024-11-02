import { NodePath } from "@babel/traverse";
import {
  getExport,
  getNodeOrigin,
  getObjectExpressionProperty,
  parseBundleToAst,
  readFile,
} from "@chainlink-io/core";
import { ChainlinkConfig, ReadFileResult } from "@chainlink-io/types";
import { Hono } from "hono";

import { generate } from "@/babel";

import { BaseApiResult, WithBaseApiResult } from "./schemas/base-api-result";

export function getApiRoutes(config: ChainlinkConfig) {
  const api = new Hono();

  api.get("/getConfig", async (c) => {
    return c.json({
      success: true,
      data: config,
    } satisfies BaseApiResult);
  });

  api.get("/readFile", async (c) => {
    const filePath = c.req.query("filePath");

    if (!filePath) {
      return c.json(
        {
          success: false,
          error: "Bad request",
        } satisfies BaseApiResult,
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

      const nodePaths = {
        url: generate(urlOrigin.node).code,
        queryParams: generate(queryParamsOrigin.node).code,
      };

      console.log(nodePaths);

      return c.json({
        success: true,
        data: await readFile(config, filePath),
      } satisfies WithBaseApiResult<ReadFileResult>);
    } catch (e) {
      console.error(e);
      return c.json(
        {
          success: false,
          error: "Internal server error",
        } satisfies BaseApiResult,
        { status: 500 },
      );
    }
  });

  return api;
}
