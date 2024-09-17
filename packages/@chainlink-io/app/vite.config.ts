import { getConfig } from "@chainlink-io/core";
import devServer from "@hono/vite-dev-server";
import baseViteConfig from "@repo/shared/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { WebSocketServer } from "ws";

import { attachWsListeners, isProd } from "./src/ws";

declare global {
  // eslint-disable-next-line
  var __chainlink_wss: WebSocketServer | undefined;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4202,
    watch: {
      ignored: [/__chainlink_temp/],
    },
  },
  build: {
    outDir: "./dist/static",
  },
  plugins: [
    ...baseViteConfig.plugins!,
    react(),
    devServer({
      entry: "./server.ts",
      exclude: [
        // Matches any string NOT containing "/api" UNLESS it also contains "/src"
        /^(((?!\/api).)|(.*\/src.*))*$/,
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
});
