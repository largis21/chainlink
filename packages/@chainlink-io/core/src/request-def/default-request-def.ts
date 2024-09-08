import { ChainlinkRequestDefinition } from "..";

export const defaultChainlinkRequestDefinition: ChainlinkRequestDefinition = {
  url: "", // *
  method: "", // *
  queryParams: [],
  extends: null,
} as const;
// * = Is reqired in ChainlinkRequestDefinition, their value here is not important because it will
// be overriden anyway
