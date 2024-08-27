import { z } from "zod";
import {
  callServiceFromServer,
  WSIOSchemas,
  WSService,
  WSServiceRunner,
} from "..";
import fs from "fs/promises";
import path from "path";

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
        results.push({
          type: "file",
          name: item,
          parentPath: parentPath,
          content: "@TODO"
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
