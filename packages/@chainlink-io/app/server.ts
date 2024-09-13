import { readFile } from "node:fs/promises";
import path from "node:path";

import { getConfig } from "@chainlink-io/core";
import { ChainlinkConfig } from "@chainlink-io/types";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { WebSocketServer } from "ws";

import { getApiRoutes } from "./src/server/api";
import { attachWsListeners, isProd } from "./src/ws";

const html = await readFile(
  isProd
    ? path.resolve(import.meta.dirname, "./static/index.html")
    : "index.html",
  "utf8",
);

function getHonoApp(config: ChainlinkConfig): Hono {
  const app = new Hono();

  app.route("/api", getApiRoutes(config));

  app.use(
    "/assets/*",
    serveStatic({
      root: path.relative(
        process.cwd(),
        path.join(import.meta.dirname, "./static"),
      ),
    }),
  );

  app.get("/", (c) => {
    return c.html(html);
  });

  return app;
}

async function serveApp(config: ChainlinkConfig) {
  // The frontend needs this
  process.env["VITE_PORT"] = config.server.port.toString();

  const server = serve(
    { ...getHonoApp(config), port: config.server.port },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`);
    },
  );

  const wss = new WebSocketServer({
    // @ts-expect-error It works
    server: server,
  });

  attachWsListeners(wss, config);
}

let devConfig: ChainlinkConfig;
if (!isProd) {
  devConfig = await getConfig(
    path.resolve(
      import.meta.dirname,
      "../../../dev/dev-api/chainlink.config.ts",
    ),
  );
}

export default getHonoApp(devConfig!);

// Exported for cli
export { serveApp };
