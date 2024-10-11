import { ReadFileResult } from "@chainlink-io/core";
import { create } from "zustand";

import { readFile } from "@/api/useApi";

type SetPatch = {
  path: string;
  value: string;
};

type InsertPatch = {
  after: string;
  path: string;
  value: string;
};

type Patch = { set: SetPatch } | { insert: InsertPatch };

export type LoadedFile = ReadFileResult & {
  fileType: "requestDef";
  filePath: string;
  patches: Patch[];
};

export const useLoadedFiles = create<{
  loadedFiles: LoadedFile[];
  loadFile: (filePath: string) => Promise<void>;

  openedFile: LoadedFile | null;
  openFile: (filePath: string) => void;
}>((set, get) => ({
  loadedFiles: [],
  loadFile: async (filePath) => {
    const file = await readFile(filePath);
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
