import { cn } from "@/src/lib/utils";
import { useFsState } from "@/src/state/fs-state";
import { ChevronRight, Folder } from "lucide-react";
import { useMemo, useState } from "react";
import { Spinner } from "@/src/components/spinner";
import type { FsDirectory, FsDirectoryFileNode } from "@chainlink-io/core";

type FileHierarchy = (Omit<FsDirectory[number], "parentPath"> & {
  children: FileHierarchy;
  originalNode: FsDirectory[number];
})[];

function buildTree(
  items: FsDirectory,
  parentPath: string = "/",
): FileHierarchy {
  return items
    .filter((item) => item.parentPath === parentPath)
    .map((item) => ({
      ...item,
      children: buildTree(
        items,
        `${parentPath}/${item.name}`.replace("//", "/"),
      ),
      originalNode: item,
    }))
    .sort((a) => (a.type === "dir" ? -1 : 1));
}

export function FileTree(props: {
  selectedFile: FsDirectoryFileNode | null;
  setSelectedFile: (file: FsDirectoryFileNode) => void;
}) {
  const fsState = useFsState();

  const tree = useMemo(
    () => buildTree(fsState.requestsDir || []),
    [fsState.requestsDir],
  );

  if (!fsState.requestsDir.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return tree.map((node) => (
    <FileNode
      node={node}
      index={0}
      key={node.name}
      selectedFile={props.selectedFile}
      setSelectedFile={props.setSelectedFile}
    />
  ));
}

function FileNode(props: {
  node: FileHierarchy[number];
  index: number;
  selectedFile: FsDirectoryFileNode | null;
  setSelectedFile: (file: FsDirectoryFileNode) => void;
}) {
  const [open, setOpen] = useState(false);

  const padding = 22;

  return (
    <div className="relative">
      {props.node.type === "dir" ? (
        <div>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-1 w-full hover:bg-accent py-1 relative"
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
              <FileNode
                key={i}
                node={node}
                index={props.index + 1}
                selectedFile={props.selectedFile}
                setSelectedFile={props.setSelectedFile}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={"py-1 hover:bg-accent relative"}
          style={{
            paddingLeft: padding * props.index + 4,
          }}
          onClick={() =>
            props.setSelectedFile(
              props.node.originalNode as FsDirectoryFileNode,
            )
          }
        >
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
