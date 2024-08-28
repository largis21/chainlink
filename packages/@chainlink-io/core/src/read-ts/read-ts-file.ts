import nodePath from "path";
import fs from "fs/promises";
import { build} from "esbuild"

export async function readTsFile(path: string): Promise<{
  default: unknown;
  [key: string]: unknown;
} | null> {
  // A previous solution was to just generate a string of the result and use dynamic import() to 
  // evaluate it. However it could not resolve external dependencies (external: [/node_modules/] results
  // in rollup bundling itself which doesn't work)
  // The solution was to bundle to a file, import() the bundled file and delete the file after

  const outFile = nodePath.join(path, "../__chainlink_temp.mjs");

  let output = null;

  try {
    await build({
      entryPoints: [path],
      bundle: true,
      format: "esm",
      platform: "node",
      external: ["node_modules", "@chainlink-io/chainlink"],
      outfile: outFile,
      write: true,
      logLevel: "silent",
      drop: ["console", "debugger"]
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
