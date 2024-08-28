import { useEffect } from "react";

export function useWsListener<K extends keyof WebSocketEventMap>(
  ws: WebSocket | null | undefined,
  event: K,
  onEvent: (data: WebSocketEventMap[K]) => void
) {
  useEffect(() => {
    if (!ws) {
      return;
    }

    ws.addEventListener(event, onEvent);

    return () => {
      ws?.removeEventListener(event, onEvent);
    };
  }, [ws, event, onEvent]);
}
