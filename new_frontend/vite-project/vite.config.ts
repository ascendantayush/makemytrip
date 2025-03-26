import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Disable type checking during build
  },
  // Disable ESLint during build
  esbuild: {
    legalComments: "none",
    jsx: "automatic",
    // This will make ESBuild skip linting
    logOverride: { "eslint-plugin": "silent" },
  },
});
