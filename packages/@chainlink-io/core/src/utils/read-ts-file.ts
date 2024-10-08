import { ChainlinkConfig } from "@chainlink-io/types";
import { build } from "esbuild";
import fs from "fs/promises";
import nodePath from "path";

import { ChainlinkContext } from "@/cl-context";

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
  text: string;
  sourceMap: string;
}> {
  // A previous solution was to just generate a string of the result and use dynamic import() to
  // evaluate it. However it could not resolve external dependencies (external: [/node_modules/] results
  // in rollup bundling itself which doesn't work)
  // The solution was to bundle to a file, import() the bundled file and delete the file after
  const outDir = nodePath.join(
    path,
    `../__chainlink_temp_${path.split("/").at(-1)}_${Math.floor(Math.random() * 100000)}`,
  );
  const outFile = nodePath.join(
    outDir,
    // dynamic import has some caching behavior, this _almost_ makes sure that it actually evaluates
    // the file
    `index-${Math.floor(Math.random() * 100000)}.mjs`,
  );

  await fs.rm(outDir, { force: true, recursive: true });
  await fs.mkdir(outDir, {});

  let output = {
    exports: null,
    text: "",
    sourceMap: "",
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
      treeShaking: true,
    });

    output = {
      exports: await import(/* @vite-ignore */ outFile).catch(() => ({})),
      text: await fs.readFile(outFile).then((e) => e.toString()),
      sourceMap: await fs
        .readFile(outFile.replace(".mjs", ".mjs.map"))
        .then((e) => e.toString()),
    };
  } catch (e) {
    console.log(e);
  }

  // @TODO handle error
  await fs.rm(outDir, { force: true, recursive: true });

  return output;
}
