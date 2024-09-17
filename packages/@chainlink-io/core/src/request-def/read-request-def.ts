import {
  ChainlinkConfig,
  ChainlinkRequestDefinition,
  requiredChainlinkRequestDefinitionProperties,
} from "@chainlink-io/types";

import { generate } from "@/babel-import";
import { createClContext } from "@/cl-context";
import { deepMerge, isObject, readFile } from "@/utils";

import { defaultChainlinkRequestDefinition } from ".";
import { getRequestDefinitionNodePaths } from "./editable-request-def/get-request-definition-node-paths";

export type ReadRequestDefResult<
  TGetStringifiedPropertySources extends boolean,
> = {
  requestDefinition: ChainlinkRequestDefinition;
  stringifiedPropertySources: TGetStringifiedPropertySources extends true
  ? Partial<Record<keyof ChainlinkRequestDefinition, string>>
  : undefined;
};

export async function readRequestDef<
  TGetStringifiedPropertySources extends boolean = false,
>(
  config: ChainlinkConfig,
  filePath: string,
  options?: {
    getStringifiedPropertySources?: TGetStringifiedPropertySources;
  },
): Promise<ReadRequestDefResult<TGetStringifiedPropertySources>> {
  type Result = ReadRequestDefResult<TGetStringifiedPropertySources>;
  const result: Result = {} as Result;

  const maybeRequestDef = await readFile(config, filePath, {
    clContext: createClContext(config),
  });

  const invalidRequestError = new TypeError(
    `'${filePath}' does not have a valid request definition as it's default export`,
  );

  if (!maybeRequestDef?.exports.default) {
    throw invalidRequestError;
  }

  if (!isObject(maybeRequestDef.exports.default)) {
    throw invalidRequestError;
  }

  for (const prop of requiredChainlinkRequestDefinitionProperties) {
    if (!(prop in maybeRequestDef.exports.default)) {
      throw invalidRequestError;
    }
  }

  // Merging with the defaultChainlinkRequestDefinition so we don't need as many nullchecks down
  // the road
  result.requestDefinition = deepMerge<ChainlinkRequestDefinition>(
    defaultChainlinkRequestDefinition,
    maybeRequestDef.exports.default,
  );

  if (options?.getStringifiedPropertySources) {
    const nodePaths = await getRequestDefinitionNodePaths(config, filePath);
    const stringifiedProperties = Object.keys(
      nodePaths.requestDefinitionNodePaths,
      // You can type this properly if you want
    ).reduce<Record<string, string>>((acc, cur) => {
      if (!(cur in nodePaths.requestDefinitionNodePaths)) {
        return acc;
      }

      acc[cur] = generate(
        nodePaths.requestDefinitionNodePaths[
          cur as keyof typeof nodePaths.requestDefinitionNodePaths
        ]!.node,
      ).code;

      return acc;
    }, {});

    result.stringifiedPropertySources =
      stringifiedProperties as Result["stringifiedPropertySources"];
  }

  return result;
}
