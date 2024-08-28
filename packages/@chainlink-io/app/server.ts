import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { attachWsListeners, isProd } from "./src/ws";
import { WebSocketServer } from "ws";
import { type ChainlinkConfig } from "@chainlink-io/core";

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

const app = new Hono()
  .use(
    "/assets/*",
    serveStatic({
      root: isProd
        ? path.relative(
          process.cwd(),
          path.join(import.meta.dirname, "./static"),
        )
        : "./",
    }),
  ) // path must end with '/'
  .get("/", (c) => c.html(html));

app.get("/api/heartbeat", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/helloToCore", (c) => {
  return c.json({ status: "ok" });
});

function serveApp(config: ChainlinkConfig) {
  // The frontend needs this
  process.env["VITE_PORT"] = config.server.port.toString();

  const server = serve({ ...app, port: config.server.port }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });

  const wss = new WebSocketServer({
    // @ts-expect-error It works
    server: server,
  });

  attachWsListeners(wss, config);
}

// Exported for vite
export default app;

// Exported for cli
export { serveApp };
