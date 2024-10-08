import { memo, useMemo } from "react";

import { useFsState } from "@/state/fs-state";

import { Spinner } from "../spinner";
import { buildTree } from "./build-tree";
import { FileNode } from "./file-node";

export type FileHierarchyFile = {
  name: string;
  path: string;
  type: "requestDef" | "chainDef";
  data?: unknown;
};

export type FileHierarchy = {
  name: string;
  path: string;
  type: "dir";
  children: (FileHierarchy | FileHierarchyFile)[];
};

export const FileTree = memo(function FileTree() {
  const chainlinkDir = useFsState((state) => state.chainlinkDir);
  const tree = useMemo(() => buildTree(chainlinkDir || []), [chainlinkDir]);

  if (!chainlinkDir.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full px-2">
      {tree.children.map((node) => (
        <FileNode node={node} index={0} key={node.name} />
      ))}
    </div>
  );
});
