import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export default defineConfig({
  server: {
    proxy: {
      // "/api": process.env.VITE_API_BASE_URL,
      "/api": "https://plantopia-demo.vercel.app",
    },
  },
  plugins: [react()],
});
