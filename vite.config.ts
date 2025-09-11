import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import * as fs from "node:fs";

export default defineConfig({
  optimizeDeps: {
    exclude: ['express', 'cookie-parser', 'request'],
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // "@": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync('private.key'),
      cert: fs.readFileSync('certificate.crt'),
    },
    host: true,
    port: 5173,
  },

})