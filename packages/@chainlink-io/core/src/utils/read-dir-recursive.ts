import fs from "fs/promises"
import path from "path"

export type FsDirectoryDirNode = {
  type: "dir"
  name: string
  parentPath: string
}

export type FsDirectoryFileNode = {
  type: "file"
  name: string
  parentPath: string
}

export type FsDirectory = (FsDirectoryDirNode | FsDirectoryFileNode)[]

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
        } satisfies FsDirectoryDirNode);
      } else {
        // const filePath = path.resolve(dirPath, item)
        results.push({
          type: "file",
          name: item,
          parentPath: parentPath,
          // @TODO remove
          // exports: await readTsFile(filePath),
          // text: await fs.readFile(filePath).then((buf) => buf.toString())
        } satisfies FsDirectoryFileNode);
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
