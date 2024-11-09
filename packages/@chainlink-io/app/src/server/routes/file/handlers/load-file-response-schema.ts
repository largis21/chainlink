import { readFileResultSchema } from "@chainlink-io/types";
import { z } from "zod";

export const loadFileResponseSchema = readFileResultSchema.merge(
  z.object({
    stringifiedPropertySources: z.object({
      url: z.string(),
    }),
  }),
);

export type LoadFileResponse = z.infer<typeof loadFileResponseSchema>;
