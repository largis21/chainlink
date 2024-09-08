import { ChainlinkConfig } from ".";
import path from "path";
import { z } from "zod";

export const defaultConfig: ChainlinkConfig = {
  chainlinkContextName: "cl",
  chainlinkRootDir: path.resolve(process.cwd(), "chainlink"),
  chainsDir: "chains",
  env: {
    file: path.resolve(process.cwd(), ".env"),
    schema: z.object({}),
  },
  globals: {},
  requestsDir: "requests",
  server: {
    port: 4202,
  },
} as const;
