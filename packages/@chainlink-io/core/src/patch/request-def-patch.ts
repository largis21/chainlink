import { ChainlinkRequestDefinition } from "@chainlink-io/types";

import { GenericPatch } from "./patch";

// @TODO: Get all sub properties in path - maybe this is not ideal? idk
export type RequestPatch = GenericPatch<keyof ChainlinkRequestDefinition>;
