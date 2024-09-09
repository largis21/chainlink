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

const api = new Hono();

api.get("/users", (c) => {
  c.res.headers.append("Set-Cookie", "name1=value1")
  c.res.headers.append("Set-Cookie", "name2=value2")

  return c.json(users.map((e) => e.name));
});

api.get("/user/:name", (c) =>
  c.json(users.find((e) => e.name === c.req.param("name"))),
);

app.route("/api", api);

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  },
);
