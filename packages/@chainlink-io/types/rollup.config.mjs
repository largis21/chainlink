import baseConfig from "@repo/shared/rollup";
import { defineConfig } from "rollup";

export default defineConfig({
  ...baseConfig,
  input: "./src/index.ts",
  output: {
    ...baseConfig.output,
    file: "./dist/index.js",
  },
});
