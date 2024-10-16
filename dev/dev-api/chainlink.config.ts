import type {
  ChainlinkRequestDefinition,
  ClDeclareGlobal,
} from "@chainlink-io/chainlink";
import { defineConfig } from "@chainlink-io/chainlink";
import { z } from "zod";

const config = defineConfig({
  globals: {
    BASE_URL: "http://localhost:8080/api",
    BASE_QUERY_PARAMS: [
      { enabled: true, key: "Authentication", value: "Bearer 12345" },
    ] satisfies ChainlinkRequestDefinition["queryParams"],
  },
  env: {
    file: "./.env",
    schema: z.object({
      test: z.string(),
    }),
  },
} as const);

declare global {
  // eslint-disable-next-line no-var
  var cl: ClDeclareGlobal<typeof config>;
}

export default config;
