import { ReadFileResult } from "@chainlink-io/core";

import { LoadedFile, useLoadedFiles } from "@/state/loaded-files";

import { RequestEditor } from "./request-editor";

const fileTypeToPage: Record<
  NonNullable<ReadFileResult["fileType"]>,
  (props: { file: LoadedFile }) => JSX.Element
> = {
  requestDef: RequestEditor,
  chainDef: () => <></>,
};

export function OpenedFile() {
  const openedFile = useLoadedFiles((state) => state.openedFile);

  if (!openedFile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Select a file to edit
      </div>
    );
  }

  const PageComponent = fileTypeToPage[openedFile.fileType];
  return <PageComponent file={openedFile} />;
}
