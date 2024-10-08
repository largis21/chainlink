import { z } from "zod";

export const readFileResultSchema = z.object({
  text: z.string(),
  bundledText: z.string(),
  exports: z.record(z.string(), z.unknown()),
  sourceMap: z.string(),
});

export type ReadFileResult = z.infer<typeof readFileResultSchema>;
