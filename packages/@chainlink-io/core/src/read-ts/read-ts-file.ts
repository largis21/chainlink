import { rollup } from "rollup";

import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export async function readTsFile(path: string): Promise<{
  default: unknown;
  [key: string]: unknown;
} | null> {
  const { generate } = await rollup({
    input: path,
    plugins: [
      resolve({
        extensions: [".js", ".ts"],
      }),
      commonjs(),
      typescript(),
    ],
  });

  const bundle = await generate({
    format: "esm",
  });

  const code = bundle.output[0].code;

  if (!code) {
    return null;
  }

  const encodedCode = `data:text/javascript;charset=utf-8,${encodeURIComponent(code)}`;

  return await import(encodedCode);
}
