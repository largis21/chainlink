import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/",
  cors({
    origin: process.env.FRONTEND_ORIGIN || "",
  }),
);

app.get("/api/heartbeat", (c) => c.text("ok"));

export { app };
