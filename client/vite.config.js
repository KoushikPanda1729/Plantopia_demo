import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config({ path: "./.env" });
console.log(process.env.VITE_API_BASE_URL);

export default defineConfig({
  server: {
    proxy: {
      // "/api": "http://localhost:8000",
      // "/api": "https://plantopia-demo.onrender.com",
      "/api": process.env.VITE_API_BASE_URL,
    },
  },
  plugins: [react()],
});
