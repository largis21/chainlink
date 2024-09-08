import { defineConfig } from "@chainlink-io/chainlink";
import { z } from "zod";
import type { ClDeclareGlobal } from "../../packages/@chainlink-io/core/dist/config/define-config";

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
