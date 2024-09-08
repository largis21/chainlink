import { defineConfig } from "rollup";
import baseConfig from "@repo/rollup";

export default defineConfig({
  ...baseConfig,
  input: "./src/index.ts",
  output: {
    ...baseConfig.output,
    file: "./dist/index.js",
  },
});
