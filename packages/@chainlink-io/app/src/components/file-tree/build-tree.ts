import { ReadChainlinkDirResult } from "@chainlink-io/types";

import { FileHierarchy } from ".";

export function buildTree(files: ReadChainlinkDirResult): FileHierarchy {
  const root: FileHierarchy = { name: "", path: "", type: "dir", children: [] };

  // Helper function to find or create a node in the tree
  function findOrCreateNode(
    pathParts: string[],
    currentNode: FileHierarchy,
    accumulatedPath: string,
  ) {
    const part = pathParts.shift();
    if (!part) return currentNode;

    // Find an existing child node with the same name
    let child = currentNode.children.find((child) => child.name === part);

    // If no child node exists, create one
    if (!child) {
      child = {
        name: part,
        path: `${accumulatedPath}/${part}`,
        type: "dir",
        children: [],
      };
      currentNode.children.push(child);
    }

    // Recurse into the child node
    // @ts-expect-error blabla
    return findOrCreateNode(pathParts, child, `${accumulatedPath}/${part}`);
  }

  // Process each entry in the input array
  files.forEach((entry) => {
    const pathParts = entry.path.split("/");

    // Find or create the node where this entry belongs
    const node = findOrCreateNode(pathParts, root, "");

    // Assign the type and data to the node
    // @ts-expect-error blabla
    node.type = entry.type;

    // Only non-directory types might have additional data
    if (entry.type !== "dir") {
      // @ts-expect-error blabla
      node.data = entry.data || null;
      // @ts-expect-error blabla
      delete node.children; // Remove children for non-directory types
    }
  });

  return root;
}
