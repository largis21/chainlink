import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        declaration: true,
      }),
    ],
  },
  {
    input: "src/cli/index.ts",
    output: {
      file: "dist/cli/index.js",
      format: "esm", // Adjust as necessary
      sourcemap: true,
      banner: "#!/usr/bin/env node", // Ensure CLI script runs as executable
    },
    plugins: [resolve(), commonjs(), typescript({ declaration: true })],
  },
];
