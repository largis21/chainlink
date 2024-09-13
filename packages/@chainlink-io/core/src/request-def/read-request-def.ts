import { ChainlinkConfig } from "@chainlink-io/types";

import { createClContext } from "@/cl-context";
import { deepMerge, readFile } from "@/utils";

import {
  ChainlinkRequestDefinition,
  defaultChainlinkRequestDefinition,
  requestDefinitionSchema,
} from ".";

export async function readRequestDef(
  config: ChainlinkConfig,
  filePath: string,
): Promise<ChainlinkRequestDefinition> {
  const maybeRequestDef = await readFile(config, filePath, {
    clContext: createClContext(config),
  });

  const parsedRequestDef = requestDefinitionSchema.safeParse(
    maybeRequestDef?.exports.default,
  );

  if (!parsedRequestDef.success) {
    throw new TypeError(
      `'${filePath}' does not have a valid request definition as it's default export`,
    );
  }

  // Not using the parsedRequestDef because it strips all non required properties but casting should
  // be safe because it is validated
  return deepMerge<ChainlinkRequestDefinition>(
    defaultChainlinkRequestDefinition,
    maybeRequestDef?.exports.default as ChainlinkRequestDefinition,
  );
}
