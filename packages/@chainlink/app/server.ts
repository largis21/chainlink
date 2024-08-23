import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";
import { test } from "@chainlink/core";
import path from "node:path";

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

console.log(path.resolve(import.meta.dirname, "./static"));
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
  test("HELLO CORE FROM BACKEND");

  return c.json({ status: "ok" });
});

export default app;

if (isProd) {
  serve({ ...app, port: 4202 }, (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });
}
