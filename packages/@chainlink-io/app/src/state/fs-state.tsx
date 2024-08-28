import { create } from "zustand";
import type { FsDirectory } from "@chainlink-io/core";

export const useFsState = create<{
  requestsDir: FsDirectory;
  setRequestsDir: (newValue: FsDirectory) => void;
  requestsDirError: string | null;

  chainsDir: FsDirectory;
  setChainsDir: (newValue: FsDirectory) => void;
  chainsDirError: string | null;
}>((set) => ({
  requestsDir: [],
  setRequestsDir: (newValue) => set({ requestsDir: newValue }),
  requestsDirError: null,

  chainsDir: [],
  setChainsDir: (newValue) => set({ chainsDir: newValue }),
  chainsDirError: null,
}));
