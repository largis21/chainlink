import { defineConfig } from "vite";
import path from "path";
import { attachWsListeners, isProd } from "./src/ws";
import { WebSocketServer } from "ws";
import { getConfig } from "@chainlink-io/core";

import react from "@vitejs/plugin-react-swc";
import devServer from "@hono/vite-dev-server";

declare global {
  // eslint-disable-next-line
  var __chainlink_wss: WebSocketServer | undefined;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4202,
    watch: {
      ignored: [/__chainlink_temp/]
    }
  },
  build: {
    outDir: "./dist/static",
  },
  plugins: [
    react(),
    devServer({
      entry: "./server.ts",
      exclude: [
        // Matches when string ends with ".ts" or ".tsx", unless there is an "?" in front, which 
        // means it is a query param, if there is a question mark after .tsx? it will still be ignored
        // If there is any issues with loading ts tsx files, this is a good place to look
        /^[^?]*\.tsx?($|\?)/,
        /^(?!.*api).*/,
      ],
      injectClientScript: true,
    }),
    {
      name: "start-wss",
      configureServer: async () => {
        if (isProd) {
          return;
        }

        const globalKey = "__chainlink_wss" as const;
        let wss = global[globalKey];

        if (!wss) {
          wss = new WebSocketServer({
            port: parseInt(process.env.VITE_PORT || "4202") + 1,
          });
          global[globalKey] = wss;
        }

        wss.removeAllListeners();

        const configPath = path.resolve(
          process.cwd(),
          "../../../dev/dev-api/chainlink.config.ts",
        );
        const config = await getConfig(configPath);
        attachWsListeners(wss, config);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
