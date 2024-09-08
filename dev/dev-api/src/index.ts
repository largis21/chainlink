import { serve } from "@hono/node-server";
import { Hono } from "hono";

const users = [
  {
    name: "user-1",
    age: "22",
  },
  {
    name: "user-2",
    age: "28",
  },
  {
    name: "user-3",
    age: "34",
  },
];

const app = new Hono();

app.get("/users", (c) => c.json(users.map((e) => e.name)));

app.get("/user/:name", (c) =>
  c.json(users.find((e) => e.name === c.req.param("name"))),
);

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  },
);
