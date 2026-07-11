import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/scheduler/") ||
            id.includes("/react-is/") ||
            id.includes("/prop-types/")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("three") ||
            id.includes("react-globe.gl") ||
            id.includes("three-globe")
          ) {
            return "three-vendor";
          }

          if (id.includes("recharts") || id.includes("d3")) {
            return "chart-vendor";
          }

          if (id.includes("framer-motion") || id.includes("gsap")) {
            return "motion-vendor";
          }

          return "vendor";
        },
      },
    },
  },
});
