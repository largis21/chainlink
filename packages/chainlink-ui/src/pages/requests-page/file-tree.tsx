import { cn } from "@/src/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

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

function buildTree(items: Files, parentPath: string = "/"): FileHierarchy {
  return items
    .filter((item) => item.parentPath === parentPath)
    .map((item) => ({
      ...item,
      children: buildTree(
        items,
        `${parentPath}/${item.name}`.replace("//", "/"),
      ),
    }))
    .sort((a) => a.type === "dir" ? -1 : 1)
}

function FileNode(props: { node: FileHierarchy[number]; index: number }) {
  const [open, setOpen] = useState(false);

  const padding = 22

  return (
    <div>
      {props.node.type === "dir" ? (
        <div>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-1 w-full hover:bg-accent py-1"
            style={{
              paddingLeft: padding * props.index + 4,
            }}
          >
            <ChevronRight size={16} className={cn(open && "rotate-90")} />
            {props.node.name}
          </button>
          <div className={cn(open ? "h-auto" : "h-0 overflow-hidden")}>
            {props.node.children.map((node) => (
              <FileNode node={node} index={props.index + 1} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={"py-1 hover:bg-accent"}
          style={{
            paddingLeft: padding * props.index + 4,
          }}
        >
          {props.node.name}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  const tree = buildTree(files);

  return (
    <div className="">
      {tree.map((node) => (
        <FileNode node={node} index={0} />
      ))}
    </div>
  );
}
