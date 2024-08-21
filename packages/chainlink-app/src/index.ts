import { Hono } from "hono";
import { cors } from "hono/cors";

/**
 * @internal
 */
const app = new Hono();

console.log("new version")

app.use(
  "/*",
  cors({
    origin: "*",
  }),
);

app.get("/api/heartbeat", (c) => c.text("ok"));

export { app };
