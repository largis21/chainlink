import { defineConfig, PkgBundle } from "@sanity/pkg-utils";

export default defineConfig({
  dist: "./dist",
  bundles: [
    {
      source: "./src/cli/index.ts",
      require: "./dist/cli/index.js",
      runtime: "node",
    },
  ],
});
