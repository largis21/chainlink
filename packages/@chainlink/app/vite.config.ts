import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import devServer from "@hono/vite-dev-server";
import { attachWsListeners, isProd } from "./src/ws";
import { WebSocketServer } from "ws";

declare global {
  // eslint-disable-next-line
  var __chainlink_wss: WebSocketServer | undefined
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4202,
  },
  build: {
    outDir: "./dist/static",
  },
  plugins: [
    react(),
    devServer({
      entry: "./server.ts",
      exclude: [
        // We need to override this option since the default setting doesn't fit
        /.*\.tsx?($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /.*\.(svg|png)($|\?)/,
        /^\/@.+$/,
        /^\/favicon\.ico$/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],
      injectClientScript: false, // we do this manually in src/server.ts
    }),
    {
      name: "start-wss",
      configureServer() {
        if (isProd) {
          return;
        }

        const globalKey = '__chainlink_wss' as const;
        let wss = global[globalKey];

        if (!wss) {
          wss = new WebSocketServer({
            port: parseInt(process.env.VITE_PORT || '4202') + 1,
          })
          global[globalKey] = wss;
        }

        wss.removeAllListeners()

        attachWsListeners(wss)
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
