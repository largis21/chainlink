import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { attachWsListeners, isProd } from "./src/ws";
import { WebSocketServer } from "ws";
import { getConfig, type ChainlinkConfig } from "@chainlink-io/core";
import { getApiRoutes } from "./src/server/api";

let html = await readFile(
  isProd
    ? path.resolve(import.meta.dirname, "./static/index.html")
    : "index.html",
  "utf8",
);

if (!isProd) {
  // Inject Vite client code to the HTML
  html = html.replace(
    "<head>",
    `
<script type="module">
import RefreshRuntime from "/@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
</script>

<script type="module" src="/@vite/client"></script>
    `,
  );
}

function getHonoApp(config: ChainlinkConfig) {
  const app = new Hono();

  app.route("/api", getApiRoutes(config));

  app.use(
    "/assets/*",
    serveStatic({
      root: isProd
        ? path.relative(
            process.cwd(),
            path.join(import.meta.dirname, "./static"),
          )
        : "./",
    }),
  );

  app.get("/", (c) => {
    return c.html(html);
  });

  return app;
}

function serveApp(config: ChainlinkConfig) {
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

const config = await getConfig(
  path.resolve(process.cwd(), "../../../dev/dev-api/chainlink.config.ts"),
);
export default getHonoApp(config);

// Exported for cli
export { serveApp };
