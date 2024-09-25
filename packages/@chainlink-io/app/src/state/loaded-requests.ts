import { z } from "zod";
import { create } from "zustand";

import { getRequest } from "@/api/useApi";
import { requestGetSuccessSchema } from "@/server/request/schemas";

export const useLoadedRequests = create<{
  loadedRequests: Record<
    string,
    {
      requestDef: z.infer<typeof requestGetSuccessSchema>["requestDefinition"];
      stringifiedPropertySources: z.infer<
        typeof requestGetSuccessSchema
      >["stringifiedPropertySources"];
      localChanges: Partial<
        z.infer<typeof requestGetSuccessSchema>["requestDefinition"]
      >;
    }
  >;
  saveRequestChanges: (filePath: string) => void;

  currentOpenedFilePath: string | null;
  setCurrentOpenedFilePath: (filePath: string) => void;

  loadRequest: (filePath: string) => Promise<boolean>;
  pushLoadedRequests: (
    filePath: string,
    request: z.infer<typeof requestGetSuccessSchema>,
  ) => void;
}>((set, get) => ({
  loadedRequests: {},
  saveRequestChanges: (filePath) => {
    const loadedRequest = get().loadedRequests[filePath];
    if (!loadedRequest) {
      console.error(`Request with filepath '${filePath}' doesn't exist`);
      return;
    }

    console.log(loadedRequest.localChanges);
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
    get().loadedRequests[filePath] = {
      requestDef: request.requestDefinition,
      stringifiedPropertySources: request.stringifiedPropertySources,
      localChanges: {},
    };
  },
}));
