import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Vercel root
  cacheDir: ".vite",  
  server: {
    proxy: {
      "/mealdb": {
        target: "https://www.themealdb.com",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/mealdb/, "")
      }
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "src/test/setup.ts",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"]
  }
});
