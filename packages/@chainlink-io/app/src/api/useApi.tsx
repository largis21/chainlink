import { z, ZodSchema } from "zod";

export async function apiHandler<Z extends ZodSchema>(
  endpoint: string,
  options: RequestInit,
  schema: Z,
): Promise<z.infer<Z>> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, options).then(
    async (res) => {
      if (res.status !== 200) {
        throw new Error(`Request failed: 'status ${res.status}'`);
      }

      if (!res.ok) {
        throw new Error("Request was not OK");
      }

      const parsedJson = schema.safeParse(await res.json());

      if (parsedJson.success) {
        return parsedJson.data;
      }
    },
  );
}
