import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import devServer from "@hono/vite-dev-server";

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
      injectClientScript: false // we do this manually in src/server.ts
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
