import { z } from "zod";

export const readChainlinkDirResultSchema = z.array(
  z.object({
    path: z.string(),
    type: z.union([
      z.literal("dir"),
      z.literal("requestDef"),
      z.literal("chainDef"),
    ]),
    data: z.unknown().optional(),
  }),
);

export type ReadChainlinkDirResult = z.infer<
  typeof readChainlinkDirResultSchema
>;
