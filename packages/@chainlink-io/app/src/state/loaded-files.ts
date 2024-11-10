import { Node } from "@babel/traverse";
import { create } from "zustand";

import { apiLoadFile } from "@/api/useApi";
import { LoadFileResponse } from "@/server/routes/file/handlers/load-file-response-schema";

export type NodePatch = {
  /**
   * The path from exports where we look for the node to patch.
   *
   * Let nodeTypes be ["StringLiteral"]
   * If the path is "default.url" and that node is a Indentifier, if that
   * Ident resolves to a StringLiteral, that will be the node this patch will apply to
   *
   * @example "default.queryParams"
   */
  path: string;

  /**
   * This will be the node the patch is applied to
   *
   * @example ["TemplateLiteral", "StringLiteral"]
   */
  nodeTypes: Node["type"][];

  /**
   * Stringifed new value
   */
  value: string;
};

export type LoadedFile = LoadFileResponse & {
  fileType: "requestDef";
  filePath: string;
  patches: NodePatch[];
};

export const useLoadedFiles = create<{
  loadedFiles: LoadedFile[];
  loadFile: (filePath: string) => Promise<void>;

  openedFile: LoadedFile | null;
  openFile: (filePath: string) => void;
}>((set, get) => ({
  loadedFiles: [],
  loadFile: async (filePath) => {
    const file = await apiLoadFile(filePath);
    if (!file.success) {
      console.error(file.error);
      return;
    }

    const newLoadedFiles: LoadedFile[] = [
      ...get().loadedFiles,
      {
        ...file.data,
        filePath,
        fileType: "requestDef",
        patches: [],
      },
    ];

    set({ loadedFiles: newLoadedFiles });
    console.log(get());
  },

  openedFile: null,
  openFile: (filePath) => {
    set({
      openedFile:
        get().loadedFiles.find((e) => e.filePath === filePath) || null,
    });
  },
}));
