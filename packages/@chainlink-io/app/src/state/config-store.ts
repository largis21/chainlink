import { createStore, useStore } from "zustand"
import type { ChainlinkConfig } from "@chainlink-io/core"

// Defined as a vanilla store because main.tsx calls /getConfig and sets it before react starts to render
export const configStore = createStore<{
  config: ChainlinkConfig
}>((set) => ({
  // This will be set from main.tsx before the app renders so its safe to assume it is not null
  config: null as unknown as ChainlinkConfig,

  __setConfig: (newConfig: ChainlinkConfig) => {
    set({ config: newConfig })
  }
}))

export const useConfigStore = () => useStore(configStore)
