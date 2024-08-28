import { createContext, useContext, useState } from "react";
import { useFsState } from "../state/fs-state";
import { useWsListener } from "../hooks/useWsListener";

const wsContext = createContext<WebSocket | null>(null);

export function WSProvider(props: { children: React.ReactNode }) {
  const [ws] = useState(
    new WebSocket(
      import.meta.env.PROD === true 
        ? `ws://localhost:${import.meta.env.VITE_PORT}`
        : `ws://localhost:${parseInt(import.meta.env.VITE_PORT) + 1}`,
    ),
  );

  const fsState = useFsState()

  useWsListener(ws, "message", (data) => {
    try {
      // @TODO validate with zod
      const parsedData = JSON.parse(data.data)

      fsState.setRequestsDir(parsedData.requestsDir)
      fsState.setChainsDir(parsedData.chainsDir)
    } catch {
      console.error("Got invalid data from wss")
    }
  })

  return <wsContext.Provider value={ws}>{props.children}</wsContext.Provider>;
}

export function useWs() {
  return useContext(wsContext)
}
