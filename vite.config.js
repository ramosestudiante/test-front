import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.VITE_SERVER_URL_LOCAL || "http://localhost:4000";

const port = process.env.PORT || 3000;
const host = '0.0.0.0'

export default defineConfig({
  plugins: [
    vue(),
    replace({
      preventAssignment: true,
      "process.env.VITE_SERVER_URL_LOCAL": JSON.stringify(baseUrl),
    }),
  ],
  optimizeDeps: {
    include: ['vitest'],
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.js'
  },
  server: {
    port: +port,
    host: host,
  },
});
