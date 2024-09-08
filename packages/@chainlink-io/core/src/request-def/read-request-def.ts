import { ChainlinkConfig } from "@/config";
import { deepMerge, readFile } from "@/utils";
import { defaultChainlinkRequestDefinition } from "./default-request-def";
import { createClContext } from "@/cl-context";

export async function readRequestDef(
  config: ChainlinkConfig,
  filePath: string,
) {
  const requestDef = await readFile(config, filePath, {
    clContext: createClContext(config),
  });

  console.log("read:", requestDef?.exports.default);
  //
  // const mergedRequestDef = deepMerge(defaultChainlinkRequestDefinition)
}
