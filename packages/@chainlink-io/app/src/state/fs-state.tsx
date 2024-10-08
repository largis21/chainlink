import { ReadChainlinkDirResult } from "@chainlink-io/types";
import { create } from "zustand";

export const useFsState = create<{
  chainlinkDir: ReadChainlinkDirResult;
  setChainlinkDir: (newValue: ReadChainlinkDirResult) => void;
}>((set) => ({
  chainlinkDir: [],
  setChainlinkDir: (newValue) => set({ chainlinkDir: newValue }),
}));
