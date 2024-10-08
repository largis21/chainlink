import { ChevronRight, Folder } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import { useLoadedFiles } from "@/state/loaded-files";

import { FileHierarchy, FileHierarchyFile } from ".";

export function FileNode(props: {
  node: FileHierarchy | FileHierarchyFile;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  const _loadFile = useLoadedFiles((state) => state.loadFile);
  const loadFile = useCallback(async () => {
    await _loadFile(props.node.path);
  }, []);

  const padding = 22;

  return (
    <div className="relative">
      {props.node.type === "dir" ? (
        <div>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-1 w-full hover:bg-accent py-1 relative rounded-md"
            style={{
              paddingLeft: padding * props.index + 4,
            }}
          >
            <ChevronRight
              size={16}
              className={cn("pointer-events-none", open && "rotate-90")}
            />
            <Folder size={16} className="mr-1" />
            {props.node.name}
          </button>
          <div
            className={cn(open ? "h-auto" : "h-0 overflow-hidden", "relative")}
          >
            {props.node.children.map((node, i) => (
              <FileNode key={i} node={node} index={props.index + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "py-1 pl-1 hover:bg-accent relative flex gap-2 items-center rounded-md",
            // currentOpenedFilePath ===
            // `${props.node.originalNode.parentPath}/${props.node.originalNode.name}` &&
            // "bg-accent",
          )}
          style={{
            marginLeft: padding * props.index + 4,
          }}
          onClick={loadFile}
        >
          {(props.node.data as string)?.toLowerCase?.() === "get" && (
            <Label className="bg-blue-700/50">GET</Label>
          )}
          {(props.node.data as string)?.toLowerCase?.() === "post" && (
            <Label className="bg-green-700/50">POST</Label>
          )}
          {(props.node.data as string)?.toLowerCase?.() === "put" && (
            <Label className="bg-yellow-700/50">PUT</Label>
          )}
          {(props.node.data as string)?.toLowerCase?.() === "delete" && (
            <Label className="bg-red-700/50">DELETE</Label>
          )}
          {props.node.name}
        </div>
      )}

      {props.index > 0 && (
        <div
          className="absolute top-0 left-0 h-full pointer-events-none"
          style={{
            width: padding * props.index,
            transform: `translateX(${padding * props.index}px)`,
          }}
        >
          <div className="absolute w-[1px] bg-slate-500/40 h-full left-[-10px]" />
        </div>
      )}
    </div>
  );
}

function Label(props: { children: React.ReactNode; className: string }) {
  return (
    <span className={cn("p-1 text-xs rounded-md", props.className)}>
      {props.children}
    </span>
  );
}
