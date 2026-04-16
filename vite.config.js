import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",

  server: {
    port: 3000,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: true,
  },

  optimizeDeps: {
    include: [
      "react-icons/fi",
      "react-icons/fa",
    ],
  },
});