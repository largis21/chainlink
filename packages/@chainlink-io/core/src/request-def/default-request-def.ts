import { ChainlinkRequestDefinition } from "..";

export const defaultChainlinkRequestDefinition: ChainlinkRequestDefinition = {
  url: "", // *
  method: "", // *
  queryParams: [],
} as const;
// * = Is reqired in PartialChainlinkRequestDefinition, their value here is not important because it will
// be overriden anyway
