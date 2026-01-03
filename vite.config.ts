import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: "./examples/index.html",
  },
  root: "examples",
  publicDir: "../sounds",
  build: {
    outDir: "../dist",
  },
});
