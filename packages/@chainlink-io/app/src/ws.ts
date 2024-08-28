import {
  type ChainlinkConfig,
  getChainsDir,
  getRequestsDir,
} from "@chainlink-io/core";
import { type WebSocketServer } from "ws";

export const isProd = process.env.NODE_ENV !== "development";

export function attachWsListeners(
  wss: WebSocketServer,
  config: ChainlinkConfig,
) {
  wss.on("connection", async (ws) => {
    ws.on("error", console.error);

    ws.on("message", function message() {
      console.log("TODO UPDATE FS");
    });

    ws.send(
      JSON.stringify({
        requestsDir: await getRequestsDir(config),
        chainsDir: await getChainsDir(config),
      }),
    );
  });
}
