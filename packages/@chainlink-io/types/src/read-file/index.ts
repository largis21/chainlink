import { z } from "zod";

export const readFileResultSchema = z.object({
  text: z.string(),
  evaluated: z.object({
    bundledText: z.string(),
    exports: z.record(z.string(), z.unknown()),
    sourceMap: z.string(),
  }),
  meta: z.object({
    fileType: z
      .union([z.literal("requestDef"), z.literal("chainDef")])
      .optional(),
  }),
  propertySources: z
    .object({
      // @TODO FIX ANY
      nodePaths: z.any(),
      stringifiedProperties: z.record(z.string(), z.string()),
    })
    .optional(),
});

export type ReadFileResult = z.infer<typeof readFileResultSchema>;
