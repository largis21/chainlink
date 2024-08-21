import { app } from "chainlink-app";
import { serve } from "@hono/node-server";
import { getPort } from "./get-port.js";
import { serveStatic } from "@hono/node-server/serve-static";
import path from "path";

/**
 * @internal
 */
export async function _startServer() {
  const port = await getPort(4202);
  console.log("FOUND PORT", port)

  const relativePathToStatic = path.relative(
    process.cwd(),
    path.join(__dirname, "../..", "static"),
  );

  app.get(
    "/*",
    serveStatic({
      root: relativePathToStatic,
    }),
  );
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
