/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    testTimeout: 30000,
    coverage: {
      provider: "istanbul",
    },
  },
  server: {
    origin: "http://127.0.0.1:8080",
    port: 8080,
  },
});
