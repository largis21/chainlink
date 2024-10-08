import baseConfig from "@repo/shared/rollup";
import { defineConfig } from "rollup";

export default defineConfig([
  // For exporting the runCli command
  {
    ...baseConfig,
    input: "./src/index.ts",
    output: {
      ...baseConfig.output,
      file: "./dist/index.js",
    },
  },

  // For running the cli
  {
    ...baseConfig,
    input: "./src/runCli.ts",
    output: {
      ...baseConfig.output,
      file: "./dist/runCli.js",
      banner: "#!/usr/bin/env node",
    },
  },
]);
