import { ChainlinkConfig } from "@chainlink-io/types";
import path from "path";
import { z } from "zod";

export const defaultConfig: ChainlinkConfig = {
  chainlinkContextName: "cl",
  chainlinkDir: path.resolve(process.cwd(), "chainlink"),
  env: {
    file: path.resolve(process.cwd(), ".env"),
    schema: z.object({}),
  },
  globals: {},
  server: {
    port: 4202,
  },
} as const;
