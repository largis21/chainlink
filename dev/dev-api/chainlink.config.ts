import { defineConfig } from "@chainlink-io/chainlink";
import { z } from "zod";
import type { ClDeclareGlobal } from "@chainlink-io/chainlink";

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
  var cl: ClDeclareGlobal<typeof config>
}

export default config;
