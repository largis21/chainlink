import { z } from "zod";
import { PartialChainlinkRequestDefinition } from ".";

export const requestDefinitionSchema = z.object({
  url: z.string(),
  method: z.string(),
})

const satisfiesPartialChainlinkRequestDefinition: z.infer<typeof requestDefinitionSchema> extends PartialChainlinkRequestDefinition ? true : false = true
