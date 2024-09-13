import baseConfig from "@repo/shared/rollup";
import { defineConfig } from "rollup";

export default defineConfig({
  ...baseConfig,
  input: "./server.ts",
  output: {
    ...baseConfig.output,
    dir: "./dist",
  },
});
