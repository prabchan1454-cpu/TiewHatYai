import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32.png", "apple-touch-icon.png", "logo.svg"],
      manifest: {
        name: "TiewHatyai · เที่ยวหาดใหญ่",
        short_name: "เที่ยวหาดใหญ่",
        description: "ซูเปอร์แอปเที่ยวหาดใหญ่–สงขลา พร้อมผู้ช่วย AI น้องเที่ยว ภารกิจ เหรียญรางวัล โรงพยาบาลและเหตุฉุกเฉิน",
        lang: "th",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1b2a4a",
        theme_color: "#1b2a4a",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Precache the app shell so it opens offline; SPA routes fall back to index.html.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            // Weather can serve a recent cached value when offline.
            urlPattern: ({ url }) => url.origin === "https://api.open-meteo.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "open-meteo",
              expiration: { maxEntries: 8, maxAgeSeconds: 1800 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5174,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
