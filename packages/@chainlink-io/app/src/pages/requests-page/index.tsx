import { useCallback, useState } from "react";
import { FileTree } from "./file-tree";
import { FsDirectoryFileNode, ReadFileResult } from "@chainlink-io/core";
import { RequestFileEditor } from "./request-file-editor";
import { apiHandler } from "@/src/api/useApi";
import { successfulReadFileResult } from "@chainlink-io/schemas";
import path from "path-browserify"

export function RequestsPage() {
  const [selectedFile, _setSelectedFile] = useState<FsDirectoryFileNode | null>(
    null,
  );

  const [selectedFileContent, setSelectedFileContent] = useState<ReadFileResult>(null)

  const setSelectedFile = useCallback(async (file: FsDirectoryFileNode) => {
    _setSelectedFile(file)

    const filePath = path.join("requests", file.parentPath, file.name)
    console.log(filePath)
    // Trailing slash very important vite dies without it
    const res = await apiHandler(`/fs/readFile?path=requests/users.ts`, {}, successfulReadFileResult)
  }, [])

  return (
    <div className="w-full h-full flex">
      <div className="w-80 border-r h-full">
        <FileTree
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>
      <div className="flex-grow">
        <RequestFileEditor selectedFile={selectedFile} />
      </div>
    </div>
  );
}
