import { z } from "zod";

export const baseApiResultSchema = <T extends z.ZodSchema>(successSchema: T) =>
  z.union([
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

export type SuccessBaseApiResult<T> = Omit<
  Extract<z.infer<typeof _baseApiResultSchema>, { success: true }>,
  "data"
> & { data: T };

export type ErrorBaseApiResult = Extract<BaseApiResult, { success: false }>;

export type BaseApiResult = z.infer<typeof _baseApiResultSchema>;

export type WithBaseApiResult<T> = SuccessBaseApiResult<T> | ErrorBaseApiResult;
