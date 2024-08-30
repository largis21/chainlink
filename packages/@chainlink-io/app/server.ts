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

async function getHonoApp(_config: ChainlinkConfig): Promise<Hono> {
  let config: ChainlinkConfig = _config

  if (!_config) {
    if (isProd) {
      // If _config is not provided and we are in prod, it is because the default export of this file
      // Simply ignore this function call if that is the case, as we use the serveApp function anyway
      // @ts-expect-error We dont need default export in prod
      return
    } else {
      // If _config is not provided and we are in dev mode, set to the dev config
      config = await getConfig("../../../dev/dev-api/chainlink.config.ts")
    }
  }

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

async function serveApp(config: ChainlinkConfig) {
  // The frontend needs this
  process.env["VITE_PORT"] = config.server.port.toString();

  const app = await getHonoApp(config)

  const server = serve(
    { ...app, port: config.server.port },
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

// @ts-expect-error Calling wihout a config here will get the config from the dev
// If we call getConfig down here, it will be ran even in production which breaks everything
export default getHonoApp();

// Exported for cli
export { serveApp };
