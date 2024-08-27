import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { defineConfig } from "rollup";

const includeChainlinkCoreInBundle = (id) => {
  return id !== 'module-to-include' && !id.startsWith('.');
}

export default defineConfig([
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    external: includeChainlinkCoreInBundle,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
      }),
    ],
  },
])
