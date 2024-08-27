import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isProd, attachWsListeners } from "./src/ws";
import { WebSocketServer } from "ws";

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

// const {injectWebSocket, upgradeWebSocket} = createNodeWebSocket({ app})

app.get("/api/heartbeat", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/helloToCore", (c) => {
  return c.json({ status: "ok" });
});

if (isProd) {
  const server = serve(
    { ...app, port: parseInt(process.env.VITE_PORT || "4202") },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`);
    },
  );

  const wss = new WebSocketServer({
    // @ts-expect-error It works
    server: server,
  });

  attachWsListeners(wss);
}

export default app;
