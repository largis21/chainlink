import { z } from "zod";

export const baseApiResultSchema = (successSchema: z.ZodSchema) =>
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: successSchema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]);

const _baseApiResultSchema = baseApiResultSchema(z.any());

export type BaseApiResult = z.infer<typeof _baseApiResultSchema>;

export type WithBaseApiResult<T> = BaseApiResult & { data: T };
