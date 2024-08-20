import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs/promises";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
  }),
);

app.get("/heartbeat", (c) => c.text("ok"));

app.get("/directory", async (c) => {
  c.json(await fs.readdir(import.meta.dirname));
});

export { app };
