import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default defineConfig({
  output: {
    format: "esm",
    sourcemap: true,
  },
  external: [
    /node_modules/,
    // These have to be added manually because they don't get recognized as
    // external dependencies for some reason
    "@chainlink-io/chainlink",
    "@chainlink-io/app",
    "@chainlink-io/cli",
    "@chainlink-io/core",
  ],

  plugins: [
    resolve(),
    commonjs(),
    typescript({
      declaration: true,
    }),
  ],
});
