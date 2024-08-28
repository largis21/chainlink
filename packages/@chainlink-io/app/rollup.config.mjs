import baseConfig from "@repo/rollup"
import { defineConfig } from "rollup"

export default defineConfig({
  ...baseConfig,
  input: "./server.ts",
  output: {
    ...baseConfig.output,
    dir: "./dist"
  }
});
