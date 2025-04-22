import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                // target: "http://gcpserver.natapp1.cc",
                target: "http://localhost:3000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        host: "0.0.0.0",
        allowedHosts: ["gcpserver.natapp1.cc","hmke48.natappfree.cc"],
    },
});
