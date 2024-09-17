import { readRequestDef, ReadRequestDefResult } from "@chainlink-io/core";
import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";
import { z } from "zod";

import { BaseApiResult, baseApiResultSchema } from "../schemas/base-api-result";
import { requestGetSuccessSchema } from "./schemas";

export function getApiRequestRoutes(config: ChainlinkConfig) {
  const route = new Hono();

  route.get("/:path{.+}", async (c) => {
    const filePath = c.req.param("path");

    const successSchema = baseApiResultSchema(requestGetSuccessSchema);

    let request: ReadRequestDefResult<true>;
    try {
      request = await readRequestDef(config, filePath, {
        getStringifiedPropertySources: true,
      });
    } catch (e) {
      c.status(500);
      if (e instanceof Error) {
        return c.json({
          success: false,
          error: e.message,
        } satisfies BaseApiResult);
      }

      throw e;
    }

    const result = {
      success: true,
      data: request satisfies z.infer<typeof requestGetSuccessSchema>,
    } satisfies BaseApiResult;

    if (!successSchema.safeParse(result).success) {
      c.status(500);
      return c.json({
        success: false,
        error: `Internal server error: Could not read '${filePath}'`,
      } satisfies BaseApiResult);
    }

    return c.json(result);
  });

  return route;
}
