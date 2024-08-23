import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { WebSocketServer } from "ws";

const isProd = process.env["NODE_ENV"] === "production";
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
      rewriteRequestPath: (path) => {
        console.log(path);
        return path;
      },
    }),
  ) // path must end with '/'
  .get("/", (c) => c.html(html));

app.get("/api/heartbeat", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/helloToCore", (c) => {
  return c.json({ status: "ok" });
});

export default app;

let server;
if (isProd) {
  server = serve({ ...app, port: import.meta.env.VITE_PORT }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}

const wss = new WebSocketServer({
  // @ts-expect-error It works
  server: server,
  // In prod it attaches to the server^ in dev it runs on the port above
  port: isProd ? undefined : parseInt(import.meta.env.VITE_PORT) + 1,
});

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});
