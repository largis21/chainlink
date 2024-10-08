import { readChainlinkDirResultSchema } from "@chainlink-io/types";
import { createContext, useContext, useEffect, useState } from "react";

import { useWsListener } from "../hooks/useWsListener";
import { useFsState } from "../state/fs-state";

const WsContext = createContext<WebSocket | null>(null);

export function WSProvider(props: { children: React.ReactNode }) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    setWs(
      new WebSocket(
        import.meta.env.PROD === true
          ? `ws://localhost:${import.meta.env.VITE_PORT}`
          : `ws://localhost:${parseInt(import.meta.env.VITE_PORT) + 1}`,
      ),
    );
  }, []);

  const fsState = useFsState();

  useWsListener(ws, "message", (data) => {
    try {
      const parsedData = readChainlinkDirResultSchema.parse(
        JSON.parse(data.data)?.chainlinkDir,
      );

      fsState.setChainlinkDir(parsedData);
    } catch {
      console.error("Got invalid data from wss");
    }
  });

  return <WsContext.Provider value={ws}>{props.children}</WsContext.Provider>;
}

export function useWs() {
  return useContext(WsContext);
}
