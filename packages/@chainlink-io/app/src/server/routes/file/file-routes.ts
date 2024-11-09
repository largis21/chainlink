import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { getLoadFileHandler } from "./handlers/load-file-handler";

export function getFileRoutes(config: ChainlinkConfig) {
  const fileRoutes = new Hono();

  fileRoutes.get("/load", getLoadFileHandler(config));

  return fileRoutes;
}
