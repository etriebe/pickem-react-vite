import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), cloudflare(), mkcert()],
});
