import { createContext, useContext, useState } from "react";

// Exported so SocketStatus can use this directly
export const Socket = createContext<WebSocket | null>(null);

export function WSProvider(props: { children: React.ReactNode }) {
  const [socket] = useState(
    new WebSocket(
      import.meta.env.NODE_ENV === "production"
        ? `ws://localhost:${import.meta.env.VITE_PORT}`
        : `ws://localhost:${parseInt(import.meta.env.VITE_PORT) + 1}`,
    ),
  );

  return <Socket.Provider value={socket}>{props.children}</Socket.Provider>;
}

export function useWS() {
  // Casting because the user will get an error dialog if it doesn't work anyway
  const socket = useContext(Socket) as WebSocket

}
