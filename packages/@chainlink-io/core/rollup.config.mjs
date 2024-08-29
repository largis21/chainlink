import { defineConfig } from "rollup";
import baseConfig from "@repo/rollup";
import typescript from "@rollup/plugin-typescript"

export default defineConfig([
  {
    ...baseConfig,
    input: "./src/index.ts",
    output: {
      ...baseConfig.output,
      file: "./dist/core/index.js",
    },
  },
  {
    ...baseConfig,
    input: "./src/schemas/index.ts",
    output: {
      ...baseConfig.output,
      file: "./dist/schemas/index.js",
    },
    plugins: [
      ...baseConfig.plugins,
      typescript({
        rootDir: "./src/schemas",
        include: "./src/schemas",
        declaration: true,
      })
    ]
  },
]);
