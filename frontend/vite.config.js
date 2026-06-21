import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config. The proxy forwards any request starting with /api
// to the backend at http://localhost:5000, so the frontend can call
// "/api/..." without worrying about ports or CORS during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
