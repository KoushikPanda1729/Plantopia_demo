import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    proxy: {
      // "/api": "http://localhost:8000",
      // "/api": process.env.VITE_API_BASE_URL,
      // "/api": "https://plantopia-demo.vercel.app",
      "/api": "https://plantopia-demo.onrender.com",
    },
  },
  plugins: [react()],
});
