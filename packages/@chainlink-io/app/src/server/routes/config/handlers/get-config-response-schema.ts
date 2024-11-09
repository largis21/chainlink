import { chainlinkConfigSchema } from "@chainlink-io/types";
import { z } from "zod";

export const getConfigResponseSchema = z.object({
  config: chainlinkConfigSchema,
});

export type GetConfigResponse = z.infer<typeof getConfigResponseSchema>;
