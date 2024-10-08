import { readChainlinkDir } from "@chainlink-io/core";
import { ChainlinkConfig } from "@chainlink-io/types";
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

    const chainlinkDir = await readChainlinkDir(config);

    ws.send(
      JSON.stringify({
        chainlinkDir,
      }),
    );
  });
}
