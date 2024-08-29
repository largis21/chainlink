import { FsDirectoryFileNode } from "@chainlink-io/core";

export function RequestFileEditor(props: {
  selectedFile: FsDirectoryFileNode | null;
}) {
  if (!props.selectedFile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Please select a file
      </div>
    );
  }

  return <div className="h-12 border-b"></div>;
}
