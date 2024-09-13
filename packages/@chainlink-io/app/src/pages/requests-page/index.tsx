import { FsDirectoryFileNode } from "@chainlink-io/core";
import { useCallback, useState } from "react";

import { FileTree } from "./file-tree";
import { RequestEditor } from "./request-editor";
// import { successfulReadFileResult } from "@chainlink-io/schemas";
// import path from "path-browserify"

export function RequestsPage() {
  const [selectedFile, _setSelectedFile] = useState<FsDirectoryFileNode | null>(
    null,
  );

  // const [selectedFileContent, setSelectedFileContent] = useState<ReadFileResult>(null)
  //
  const setSelectedFile = useCallback(async (_file: FsDirectoryFileNode) => {
    // _setSelectedFile(file)
    //
    // // const filePath = path.join("requests", file.parentPath, file.name)
    // const res = await apiHandler(`/fs/readFile?path=requests/user/users.ts/`, {}, z.any())
    // console.log(res)
  }, []);

  return (
    <div className="w-full h-full flex">
      <div className="w-80 border-r h-full">
        <FileTree
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>
      <div className="flex-grow">
        <RequestEditor selectedFile={selectedFile} />
      </div>
    </div>
  );
}
