import { app } from "chainlink-app";
import { serve } from "@hono/node-server";
import { getPort } from "./get-port.js";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "path";

const port = await getPort(4042);

const relativePathToStatic = path.relative(process.cwd(), path.join(import.meta.dirname, '../..', 'static'))

app.get(
  "/*",
  serveStatic({
    root: relativePathToStatic,
  }),
);

export function startServer() {
  serve(
    {
      fetch: app.fetch,
      port: port,
    },
    (info) => {
      console.log(`Listening on http://localhost:${info.port}`);
    },
  );
}
