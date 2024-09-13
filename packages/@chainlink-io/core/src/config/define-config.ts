import { UserChainlinkConfig } from "@chainlink-io/types";
import { z } from "zod";

/**
 * @public
 *
 * Helper function for writing a typesafe chainlink config
 */
export function defineConfig<
  TEnvSchema extends z.ZodSchema,
  TGlobals extends Record<string, string>,
>(config: UserChainlinkConfig<TEnvSchema, TGlobals>) {
  return config;
}
