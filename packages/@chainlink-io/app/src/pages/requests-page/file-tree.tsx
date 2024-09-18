import type { FsDirectory, FsDirectoryFileNode } from "@chainlink-io/core";
import { ChevronRight, Folder } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import { useFsState } from "@/state/fs-state";
import { useLoadedRequests } from "@/state/loaded-requests";

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

export function FileTree() {
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

  return tree.map((node) => <FileNode node={node} index={0} key={node.name} />);
}

function FileNode(props: { node: FileHierarchy[number]; index: number }) {
  const [open, setOpen] = useState(false);

  const currentOpenedFilePath = useLoadedRequests(
    (state) => state.currentOpenedFilePath,
  );
  const loadRequest = useLoadedRequests((state) => state.loadRequest);
  const setCurrentOpenedFilePath = useLoadedRequests(
    (state) => state.setCurrentOpenedFilePath,
  );

  const loadAndOpenFile = useCallback(async () => {
    const node = props.node.originalNode;
    if (node.type !== "file") return;

    const filePath = `${node.parentPath}/${node.name}`;
    const loadFileStatus = await loadRequest(filePath);

    if (!loadFileStatus) {
      // @TODO toast?
      console.error(`Could not load request`);
      return;
    }

    setCurrentOpenedFilePath(filePath);
  }, []);

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
              <FileNode key={i} node={node} index={props.index + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "py-1 hover:bg-accent relative",
            currentOpenedFilePath ===
            `${props.node.originalNode.parentPath}/${props.node.originalNode.name}` &&
            "bg-accent",
          )}
          style={{
            paddingLeft: padding * props.index + 4,
          }}
          onClick={loadAndOpenFile}
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
