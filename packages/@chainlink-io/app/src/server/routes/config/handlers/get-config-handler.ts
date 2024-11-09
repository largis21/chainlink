import { ChainlinkConfig } from "@chainlink-io/types";
import { BlankInput, Handler, HandlerResponse } from "hono/types";

import { HonoAny } from "@/server/hono-type-helpers";
import { WithBaseApiResult } from "@/server/schemas/base-api-result";

import { GetConfigResponse } from "./get-config-response-schema";

export function getGetConfigHandler(
  config: ChainlinkConfig,
): Handler<HonoAny, HonoAny, BlankInput, HandlerResponse<GetConfigResponse>> {
  return async (c) => {
    return c.json<WithBaseApiResult<GetConfigResponse>>({
      success: true,
      data: {
        config: config,
      },
    });
  };
}
