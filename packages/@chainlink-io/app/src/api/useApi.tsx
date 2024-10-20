import { readFileResultSchema } from "@chainlink-io/types";
import { z, ZodSchema } from "zod";

import {
  baseApiResultSchema,
  WithBaseApiResult,
} from "@/server/schemas/base-api-result";

export async function apiHandler<Z extends ZodSchema>(
  endpoint: string,
  options: RequestInit,
  schema: Z,
): Promise<WithBaseApiResult<z.infer<Z>>> {
  console.log("Api handler called", endpoint);
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

export async function readFile(filePath: string) {
  return await apiHandler(
    `/readFile?filePath=${filePath}`,
    {},
    readFileResultSchema,
  );
}
