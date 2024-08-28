import fs from "fs/promises"
import path from "path"
import { readTsFile } from "../read-ts/read-ts-file"

type DirNode = {
  type: "dir"
  name: string
  parentPath: string
}

type FileNode = {
  type: "file"
  name: string
  parentPath: string
  content: string 
}

export type FsDirectory = (DirNode | FileNode)[]

export async function readDirRecursive(dirPath: string, parentPath = "/"): Promise<FsDirectory> {
  try {
    let results: FsDirectory = [];

    const items = await fs.readdir(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const isDir = (await fs.stat(itemPath)).isDirectory();

      if (isDir) {
        results.push({
          type: "dir",
          name: item,
          parentPath: parentPath,
        } satisfies DirNode);
      } else {
        results.push({
          type: "file",
          name: item,
          parentPath: parentPath,
          // @TODO This will return an object I'll come back and fix types
          content: (await readTsFile(path.resolve(dirPath, item)))?.default as string,
        } satisfies FileNode);
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
