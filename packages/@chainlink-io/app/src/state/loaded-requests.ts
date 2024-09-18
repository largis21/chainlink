import { z } from "zod";
import { create } from "zustand";

import { getRequest } from "@/api/useApi";
import { requestGetSuccessSchema } from "@/server/request/schemas";

export const useLoadedRequests = create<{
  loadedRequests: Record<
    string,
    {
      requestDef: z.infer<typeof requestGetSuccessSchema>;
      localChanges: Partial<z.infer<typeof requestGetSuccessSchema>>;
    }
  >;
  saveRequestChanges: (
    newValues: Partial<
      z.infer<typeof requestGetSuccessSchema>["stringifiedPropertySources"]
    >,
  ) => void;

  currentOpenedFilePath: string | null;
  setCurrentOpenedFilePath: (filePath: string) => void;

  loadRequest: (filePath: string) => Promise<boolean>;
  pushLoadedRequests: (
    filePath: string,
    request: z.infer<typeof requestGetSuccessSchema>,
  ) => void;
}>((set, get) => ({
  loadedRequests: {},
  saveRequestChanges: (newValues) => {
    console.log("TODO set request");
    console.log(newValues);
  },

  currentOpenedFilePath: null,
  setCurrentOpenedFilePath: (filePath: string) => {
    set({ currentOpenedFilePath: filePath });
  },

  loadRequest: async (filePath) => {
    const file = await getRequest(filePath);
    if (!file.success) return false;
    get().pushLoadedRequests(filePath, file.data);

    return true;
  },
  pushLoadedRequests: (filePath, request) => {
    get().loadedRequests[filePath] = { requestDef: request, localChanges: {} };
  },
}));
