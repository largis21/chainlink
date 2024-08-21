import { FileTree } from "@/components/file-tree";

export default function RequestsPage() {
  return (
    <div className="w-full h-full flex">
      <div className="w-80 border-r h-full">
        <FileTree />
      </div>
      <div className="flex-grow flex flex-col">
        <div className="h-12 border-b"></div>
      </div>
    </div>
  )
}
