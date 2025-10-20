import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function getHttpsConfig(): false | { key: Buffer; cert: Buffer } {
  const enable = process.env.DEV_HTTPS === "1" || process.env.VITE_HTTPS === "1";
  if (!enable) return false;
  const fs = require("node:fs");
  const certPath = process.env.SSL_CERT_FILE || process.env.VITE_SSL_CERT;
  const keyPath = process.env.SSL_KEY_FILE || process.env.VITE_SSL_KEY;
  if (certPath && keyPath && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    try {
      return { cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath) };
    } catch {}
  }
  return true as unknown as any;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);
  return {
    root: "host",
    server: {
      host: true,
      https: getHttpsConfig() || undefined,
    },
    build: {
      rollupOptions: {
        input: {
          main: "host/index.html",
        },
      },
    },
    plugins: [tailwindcss(), react()],
  };
});
