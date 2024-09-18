import { FileTree } from "./file-tree";
import { RequestEditor } from "./request-editor";

export function RequestsPage() {
  return (
    <div className="w-full h-full flex">
      <div className="w-80 border-r h-full">
        <FileTree />
      </div>
      <div className="flex-grow">
        <RequestEditor />
      </div>
    </div>
  );
}
