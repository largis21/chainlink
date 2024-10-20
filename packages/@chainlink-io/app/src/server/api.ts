import { readFile } from "@chainlink-io/core";
import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { BaseApiResult } from "./schemas/base-api-result";

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
      return c.json({
        success: true,
        data: await readFile(config, filePath),
      } satisfies BaseApiResult);
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
