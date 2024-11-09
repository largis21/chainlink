import { ChainlinkConfig } from "@chainlink-io/types";
import { Hono } from "hono";

import { getGetConfigHandler } from "./handlers/get-config-handler";

export function getConfigRoutes(config: ChainlinkConfig) {
  const configRoutes = new Hono();

  configRoutes.get("/", getGetConfigHandler(config));

  return configRoutes;
}
