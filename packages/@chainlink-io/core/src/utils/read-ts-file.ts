import nodePath from "path";
import fs from "fs/promises";
import { build } from "esbuild";
import { ChainlinkContext } from "@/cl-context";
import { ChainlinkConfig } from "@/config";

/**
 * @internal
 *
 * This function must not be exposed from core
 */
export async function __readTsFile(
  path: string,
  options?: { config?: ChainlinkConfig; clContext?: ChainlinkContext },
): Promise<{
  exports: {
    default: unknown;
    [key: string]: unknown;
  } | null;
  text: string
}> {
  // A previous solution was to just generate a string of the result and use dynamic import() to
  // evaluate it. However it could not resolve external dependencies (external: [/node_modules/] results
  // in rollup bundling itself which doesn't work)
  // The solution was to bundle to a file, import() the bundled file and delete the file after
  const outDir = nodePath.join(path, "../__chainlink_temp");
  const outFile = nodePath.join(outDir, "index.mjs");

  try {
    await fs.mkdir(outDir);
  } catch {}

  let output = {
    exports: null,
    text: "",
  };

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
      banner: {
        js:
          options?.config && options?.clContext
            ? // @TODO verify that the clContext is json serializable
              `globalThis.${options.config.chainlinkContextName} = ${JSON.stringify(options.clContext)};`
            : "",
      },
    });

    // @TODO
    const sourceMap = await fs
      .readFile(outFile.replace(".mjs", ".mjs.map"))
      .then((e) => e.toString());

    output = {
      exports: await import(/* @vite-ignore */ outFile),
      text: await fs.readFile(outFile).then((e) => e.toString())
    }
  } catch (e) {
    console.log(e);
  }

  try {
    await fs.rm(outDir, { force: true, recursive: true });
  } catch {}

  return output;
}
