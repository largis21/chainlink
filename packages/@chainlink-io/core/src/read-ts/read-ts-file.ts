import { rollup } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import nodePath from "path";
import fs from "fs/promises";

export async function readTsFile(path: string): Promise<{
  default: unknown;
  [key: string]: unknown;
} | null> {
  // A previous solution was to just generate a string of the result and use dynamic import() to 
  // evaluate it. However it could not resolve external dependencies (external: [/node_modules/] results
  // in rollup bundling itself which doesn't work)
  // The solution was to bundle to a file, import() the bundled file and delete the file after

  const outFile = nodePath.join(process.cwd(), "__chainlink_temp.js");

  let output = null;

  try {
    // ugly
    const bundle = await rollup({
      input: path,
      external: [/node_modules/, "@chainlink-io/chainlink"],
      plugins: [
        resolve({
          extensions: [".mjs", ".js", ".ts"],
        }),
        typescript(),
      ],
      treeshake: true,
    });

    await bundle.write({
      format: "esm",
      file: outFile,
    });

    output = await import(outFile);
  } catch (e) {
    console.log(e);
  }

  try {
    await fs.rm(outFile, { force: true });
  } catch {}

  return output;
}
