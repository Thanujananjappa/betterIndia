import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"], // avoid pre-bundling issues
  },
  server: {
    port: 5173, // explicit default for clarity
    strictPort: true, // prevents fallback to another port
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true, // ensures CORS headers align
        secure: false, // allow self-signed certs if https later
      },
    },
  },
});
