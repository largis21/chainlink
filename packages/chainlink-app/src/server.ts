import { Hono } from "hono";
import { cors } from "hono/cors";
import fs from "fs/promises";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.FRONTEND_ORIGIN || "",
  }),
);

console.log(`Allowing cors requests from : '${process.env.FRONTEND_ORIGIN}'`)

app.get("/heartbeat", (c) => c.text("ok"));

app.get("/directory", async (c) => {
  c.json(await fs.readdir(import.meta.dirname));
});

export { app };
