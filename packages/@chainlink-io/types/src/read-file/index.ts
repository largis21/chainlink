import { z } from "zod";

export const readFileResultSchema = z.object({
  text: z.string(),
  bundledText: z.string(),
  exports: z.record(z.string(), z.unknown()),
  sourceMap: z.string(),
  fileType: z
    .union([z.literal("requestDef"), z.literal("chainDef")])
    .optional(),
});

export type ReadFileResult = z.infer<typeof readFileResultSchema>;
