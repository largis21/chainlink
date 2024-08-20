import { app } from "chainlink-backend";
import { serve } from "@hono/node-server";

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || "3001")
}, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
});
