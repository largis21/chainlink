import { chainlinkRequestDefinitionSchema } from "@chainlink-io/types";
import { z } from "zod";

export const requestGetSuccessSchema = z.object({
  requestDefinition: chainlinkRequestDefinitionSchema,
  stringifiedPropertySources: z.object({
    url: z.string().optional(),
  }),
});
