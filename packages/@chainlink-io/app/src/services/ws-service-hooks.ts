import { useCallback, useEffect } from "react";
import { serviceMessageSchemaFromServer, wsServices } from ".";
import { z } from "zod";

export function useWsServiceHandler<K extends keyof typeof wsServices>(
  ws: WebSocket,
  services: Record<K, (data: z.infer<(typeof wsServices[K]["output"])>) => void>
) {
  const onSocketMessage = useCallback((_data: MessageEvent) => {
    let serviceMessage;
    try {
      const jsonData = JSON.parse(_data.data)
      serviceMessage = serviceMessageSchemaFromServer.parse(jsonData)
    } catch {
      console.error("Received Invalid message")
      return
    }

    if (!Object.keys(services).includes(serviceMessage.service)) {
      console.error(`Invalid service: '${serviceMessage.service}'`);
      return;
    }

    const serviceToRun = services[serviceMessage.service as K];

    const validOutput = wsServices[serviceMessage.service as keyof typeof wsServices]["output"].safeParse(serviceMessage.output)

    if (!validOutput.success) {
      console.error(`Invalid output from service: '${serviceMessage.service}'`)
      return
    }

    serviceToRun(validOutput.data)
  }, [services])

  useEffect(() => {
    ws.addEventListener("message", onSocketMessage)

    return () => {
      ws.removeEventListener("message", onSocketMessage)
    }
  }, [ws, onSocketMessage])
}

export function useWsListener(ws: WebSocket | null | undefined, event: keyof WebSocketEventMap, onEvent: () => void) {
  useEffect(() => {
    if (!ws) {
      return
    }

    ws.addEventListener(event, onEvent)

    return () => {
      ws?.removeEventListener(event, onEvent)
    }
  }, [ws, event, onEvent])
}
