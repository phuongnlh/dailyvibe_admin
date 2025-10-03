import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      "admin.dailyvibe.local",
      "dailyvibe.local",
      "api.dailyvibe.local",
    ],
  },
});
