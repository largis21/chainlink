import type { ChainlinkConfig } from "@chainlink-io/core";
import { z } from "zod";

export const chainlinkConfigSchema = z.object({
  chainlinkContextName: z.string(),
  chainlinkRootDir: z.string(),
  chainsDir: z.string(),
  env: z.object({
    file: z.string(),
    schema: z.any(),
  }),
  globals: z.record(z.string(), z.string()),
  requestsDir: z.string(),
  server: z.object({
    port: z.number(),
  }),
});

type ConfigSchema = z.infer<typeof chainlinkConfigSchema>;

const _satisfiesConfigSchema: ChainlinkConfig extends ConfigSchema
  ? true
  : false = true;

const _satisfiesChainlinkConfig: ConfigSchema extends ChainlinkConfig
  ? true
  : false = true;
