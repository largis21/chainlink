import {
  UserChainlinkConfig,
  UserChainlinkConfigTGlobal,
} from "@chainlink-io/types";
import { z } from "zod";

/**
 * @public
 *
 * Helper function for writing a typesafe chainlink config
 */
export function defineConfig<
  TEnvSchema extends z.ZodSchema,
  TGlobals extends UserChainlinkConfigTGlobal,
>(
  config: UserChainlinkConfig<TEnvSchema, TGlobals>,
): UserChainlinkConfig<TEnvSchema, TGlobals> {
  return config;
}
