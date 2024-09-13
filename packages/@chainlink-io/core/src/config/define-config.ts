import { z } from "zod";

import { PartialChainlinkConfig } from ".";

/**
 * @public
 *
 * Helper function for writing a typesafe chainlink config
 */
export function defineConfig<
  TEnvSchema extends z.ZodSchema,
  TGlobals extends Record<string, string>,
>(config: PartialChainlinkConfig<TEnvSchema, TGlobals>) {
  return config;
}

