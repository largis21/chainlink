import { z } from "zod";

export const chainlinkConfigSchema = z.object({
  TEST: z.string()
})
