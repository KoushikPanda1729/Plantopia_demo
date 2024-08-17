import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();
console.log(process.env.VITE_API_BASE_URL);

export default defineConfig({
  server: {
    proxy: {
      // "/api": "http://localhost:8000",
      // "/api": process.env.VITE_API_BASE_URL,
      // "/api": "https://plantopia-demo.vercel.app",
      "/api": process.env.VITE_API_BASE_URL,
    },
  },
  plugins: [react()],
});
