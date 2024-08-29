import { ChainlinkConfig, readFile } from "@chainlink-io/core";
import { Hono } from "hono";
import { z } from "zod";
import { successfulReadFileResult } from "@chainlink-io/schemas";

export function getFsRoutes(config: ChainlinkConfig) {
  const fsRoutes = new Hono();

  const expectedQuery = z.object({
    path: z.string(),
  });

  fsRoutes.get("/readFile", async (c) => {
    const query = c.req.query();
    const parsedQuery = expectedQuery.safeParse(query);
    if (!parsedQuery.success) {
      c.status(400);
      return c.text("Bad request");
    }

    const fileData = successfulReadFileResult.safeParse(
      await readFile(config, parsedQuery.data.path),
    );

    if (!fileData.success) {
      c.status(500);
      return c.text("Internal server error");
    }

    return c.json(fileData.data);
  });

  return fsRoutes;
}
