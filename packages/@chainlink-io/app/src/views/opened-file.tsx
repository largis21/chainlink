import { useLoadedFiles } from "@/state/loaded-files";

import { RequestEditor } from "./request-editor";

export function OpenedFile() {
  const openedFile = useLoadedFiles((state) => state.openedFile);

  if (!openedFile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Select a file to edit
      </div>
    );
  }

  return <RequestEditor file={openedFile} />;
}
