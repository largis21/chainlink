"use client"

import { cn } from "@/lib/utils";
import { ChevronRight, Folder } from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/spinner";
import { api } from "@/trpc/react";
// import { useQuery } from "@tanstack/react-query";
// import { useFetchFileTree } from "@/src/api/useApi";

type FileNode = {
  type: "file" | "dir";
  name: string;
  parentPath: string;
};

// Defined as a flat array, where each item has a parent. This makes drag and drop
// behavior much easier
type Files = FileNode[];

type FileHierarchy = (Omit<FileNode, "parentPath"> & {
  children: FileHierarchy;
})[];

const files: Files = [
  {
    name: "index",
    type: "file",
    parentPath: "/",
  },
  {
    name: "dir1",
    type: "dir",
    parentPath: "/",
  },
  {
    name: "insidedir1",
    type: "file",
    parentPath: "/dir1",
  },
  {
    name: "alsoInsideDir1",
    type: "dir",
    parentPath: "/dir1",
  },
  {
    name: "insidealsoInsideDir1",
    type: "file",
    parentPath: "/dir1/alsoInsideDir1",
  },
];

function buildTree(items: Files, parentPath = "/"): FileHierarchy {
  return items
    .filter((item) => item.parentPath === parentPath)
    .map((item) => ({
      ...item,
      children: buildTree(
        items,
        `${parentPath}/${item.name}`.replace("//", "/"),
      ),
    }))
    .sort((a) => (a.type === "dir" ? -1 : 1));
}

function FileNode(props: { node: FileHierarchy[number]; index: number }) {
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
              <FileNode key={i} node={node} index={props.index + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={"py-1 hover:bg-accent relative"}
          style={{
            paddingLeft: padding * props.index + 4,
          }}
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

export function FileTree() {
  // const { status, data, error } = useFetchFileTree();
  //
  // if (status === "pending") {
  //   return (
  //     <div className="w-full h-full">
  //       <Spinner />
  //     </div>
  //   );
  // }
  //
  // if (status === "error") {
  //   return <div>Error {error.message}</div>;
  // }

  const test = api.fsRouter.getDir.useQuery({text: "hello"})

  const data = buildTree(files)

  return (
    <div className="w-full h-full">
      {data?.map((node) => <FileNode node={node} index={0} key={node.name}/>)}
    </div>
  );
}
