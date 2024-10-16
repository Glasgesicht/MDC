import { fileURLToPath, URL } from "node:url";
import { nodePolyfills } from "vite-plugin-node-polyfills";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MDC/",
  plugins: [
    vue(),
    nodePolyfills({
      include: ["buffer"],
    }),
  ],
  optimizeDeps: {
    include: ["xml2js", "glob", "fs-extra", "graceful-fs"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
