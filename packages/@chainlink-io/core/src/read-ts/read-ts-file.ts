import nodePath from "path";
import fs from "fs/promises";
import { build } from "esbuild";

export async function readTsFile(path: string): Promise<{
  default: unknown;
  [key: string]: unknown;
} | null> {
  // A previous solution was to just generate a string of the result and use dynamic import() to
  // evaluate it. However it could not resolve external dependencies (external: [/node_modules/] results
  // in rollup bundling itself which doesn't work)
  // The solution was to bundle to a file, import() the bundled file and delete the file after
  const outDir = nodePath.join(path, "../__chainlink_temp");
  const outFile = nodePath.join(outDir, "index.mjs");

  try {
    await fs.mkdir(outDir);
  } catch {}

  let output = null;

  try {
    await build({
      entryPoints: [path],
      bundle: true,
      format: "esm",
      platform: "node",
      external: ["node_modules", "@chainlink-io/chainlink"],
      sourcemap: true,
      outfile: outFile,
      write: true,
      logLevel: "silent",
      drop: ["console", "debugger"],
    });
    
    const sourceMap = await fs.readFile(outFile.replace(".mjs", ".mjs.map")).then((e) => e.toString())
    console.log(sourceMap)

    output = await import(/* @vite-ignore */ outFile);
  } catch (e) {
    console.log(e);
  }

  try {
    await fs.rm(outDir, { force: true, recursive: true });
  } catch {}

  return output;
}
