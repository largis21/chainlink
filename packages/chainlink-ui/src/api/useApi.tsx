import { useQuery } from "@tanstack/react-query";
import { z, ZodSchema } from "zod";

function apiHandler<Z extends ZodSchema>(
  endpoint: string,
  schema: Z,
): z.infer<Z> {
  return fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`).then(
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

export function useFetchFileTree() {
  const query = useQuery({
    queryKey: ["filetree"],
    queryFn: () => apiHandler("/filetree", z.any())
  });

  return query
}
