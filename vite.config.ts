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
    origin: "http://localhost:3000",
    port: 3000,
  },
});
