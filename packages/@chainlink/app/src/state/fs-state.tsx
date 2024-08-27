import { create } from "zustand";
import { wsServices } from "../services";
import { z } from "zod";

type Directory = z.infer<typeof wsServices["fs.getRequestsDir"]["output"]>

export const useFsState = create<{
  requestsDir: Directory
  setRequestsDir: (newValue: Directory) => void
}>((set) => ({
  requestsDir: [],
  setRequestsDir: (newValue) => set({requestsDir: newValue})
}))
