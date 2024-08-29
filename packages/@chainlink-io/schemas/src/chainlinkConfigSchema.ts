import { z } from "zod";
import type { ChainlinkConfig } from "@chainlink-io/core";

export const chainlinkConfigSchema = z.object({
  chainlinkRootDir: z.string(),
  requestsDir: z.string(),
  chainsDir: z.string(),
  server: z
    .object({
      port: z.number(),
    })
});

type ConfigSchema = z.infer<typeof chainlinkConfigSchema>

const configSchemaSync: (
   ChainlinkConfig extends ConfigSchema ? true : false
) = true

const schemaConfigSync: (
   ConfigSchema extends ChainlinkConfig ? true : false
) = true
