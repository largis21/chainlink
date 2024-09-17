import type { ClDeclareGlobal } from "@chainlink-io/chainlink";
import { defineConfig } from "@chainlink-io/chainlink";
import { z } from "zod";

const config = defineConfig({
  globals: {
    BASE_URL: "http://localhost:8080/api",
  },
  env: {
    file: "./.env",
    schema: z.object({
      test: z.string(),
    }),
  },
});

declare global {
  // eslint-disable-next-line no-var
  var cl: ClDeclareGlobal<typeof config>;
}

export default config;
