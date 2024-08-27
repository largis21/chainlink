import { type WebSocketServer } from "ws";
import { handleMessageFromClient } from "./services";

export const isProd = process.env.NODE_ENV === "production";

export function attachWsListeners(wss: WebSocketServer) {
  wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
      handleMessageFromClient(data.toString(), ws);
    });
  });
}
