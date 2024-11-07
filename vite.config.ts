import { fileURLToPath, URL } from "node:url";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import packageInfo from "./package.json"; // Import package.json

import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/MDC/",
  plugins: [
    vue(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
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
  define: {
    __APP_VERSION__: JSON.stringify(packageInfo.version), // Define a global constant
    __APP_VERSION_DATE__: new Date(),
  },
});
