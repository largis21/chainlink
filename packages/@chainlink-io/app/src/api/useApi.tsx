import { z, ZodSchema } from "zod";

import { requestGetSuccessSchema } from "@/server/request/schemas";
import {
  baseApiResultSchema,
  WithBaseApiResult,
} from "@/server/schemas/base-api-result";

export async function apiHandler<Z extends ZodSchema>(
  endpoint: string,
  options: RequestInit,
  schema: Z,
): Promise<WithBaseApiResult<z.infer<Z>>> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, options).then(
    async (res) => {
      if (res.status !== 200) {
        throw new Error(`Request failed: 'status ${res.status}'`);
      }

      if (!res.ok) {
        throw new Error("Request was not OK");
      }

      const parsedJson = baseApiResultSchema(schema).safeParse(
        await res.json(),
      ) as WithBaseApiResult<z.infer<Z>>;

      if (parsedJson.success) {
        return parsedJson.data;
      }

      throw new Error("Api did not return expected result");
    },
  );
}

export async function getRequest(filePath: string) {
  return await apiHandler(`/request${filePath}`, {}, requestGetSuccessSchema);
}
