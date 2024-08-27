import { createContext, useContext, useState } from "react";
import { useWsListener, useWsServiceHandler } from "../services/ws-service-hooks";
import { useFsState } from "../state/fs-state";
import { callServiceFromClient } from "../services";

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

  useWsListener(ws, "open", () => {
    callServiceFromClient("fs.getRequestsDir", null, ws)
  })

  useWsServiceHandler(ws, {
    "fs.getRequestsDir": (data) => {
      fsState.setRequestsDir(data)
    }
  })

  return <wsContext.Provider value={ws}>{props.children}</wsContext.Provider>;
}

export function useWs() {
  return useContext(wsContext)
}
