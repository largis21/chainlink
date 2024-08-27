import { z } from "zod";
import {
  callServiceFromServer,
  WSIOSchemas,
  WSService,
  WSServiceRunner,
} from "..";
import fs from "fs/promises";
import path from "path";
import {transform} from "@swc/core"
import {} from "tsconfig-paths"

const dirSchema = z.object({
  type: z.literal("dir"),
  name: z.string(),
  parentPath: z.string(),
});

const fileSchema = z.object({
  type: z.literal("file"),
  name: z.string(),
  parentPath: z.string(),
  content: z.string()
});

const directorySchema = z.array(z.union([dirSchema, fileSchema]));

/**
 * This is a custom implementation of require.resolve that takes into account the paths
 * configuration in tsconfig.json. This is necessary if we want to resolve paths that are
 * custom defined in the tsconfig.json file.
 * Resolving here is best effort and might not work in all cases.
 * @beta
 */
export function getResolver(cwd?: string): NodeJS.RequireResolve {
  const tsConfig = loadTSConfig(cwd)

  if (tsConfig.resultType === 'failed') {
    return require.resolve
  }

  const matchPath = createMatchPath(
    tsConfig.absoluteBaseUrl,
    tsConfig.paths,
    tsConfig.mainFields,
    tsConfig.addMatchAll,
  )

  const resolve = function (request: string, options?: {paths?: string[]}): string {
    const found = matchPath(request)
    if (found !== undefined) {
      return require.resolve(found, options)
    }
    return require.resolve(request, options)
  }

  // wrap the resolve.path function to make it available.
  resolve.paths = (request: string): string[] | null => {
    return require.resolve.paths(request)
  }
  return resolve
}

async function readDirRecursive(dirPath: string, parentPath = "/") {
  try {
    let results: z.infer<typeof directorySchema> = [];

    const items = await fs.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const isDir = (await fs.stat(itemPath)).isDirectory();

      if (isDir) {
        results.push({
          type: "dir",
          name: item,
          parentPath: parentPath,
        });
      } else {
        const content = transform({})

        results.push({
          type: "file",
          name: item,
          parentPath: parentPath,
          content: (await import(itemPath)).default
        });
      }

      if (isDir) {
        results = results.concat(
          await readDirRecursive(itemPath, path.join(parentPath, item)),
        );
      }
    }

    return results;
  } catch (e) {
    console.error(e);
    return [];
  }
}

const getRequestsDirSchema = {
  input: z.union([z.null(), directorySchema]),
  output: directorySchema,
} satisfies WSIOSchemas;

const getRequestsDirRunner: WSServiceRunner<
  typeof getRequestsDirSchema
> = async (_, ws) => {
  callServiceFromServer(
    "fs.getRequestsDir",
    await readDirRecursive(
      "/home/largis21/privat/chainlink-test/chainlink/requests/",
    ),
    ws,
  );
};

const getRequestsDir = {
  input: getRequestsDirSchema.input,
  run: getRequestsDirRunner,
  output: directorySchema,
} as const satisfies WSService<typeof getRequestsDirSchema>;

export { getRequestsDir };
