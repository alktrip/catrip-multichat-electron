import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const pkgPath = path.resolve(__dirname, "package.json");
const pkgVersion = JSON.parse(fs.readFileSync(pkgPath, "utf-8")).version as string;

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "src/renderer"),
  /** Íconos del proyecto origen (SVG): servidos en /system/*.svg y /org.k3p.catrip-multichat.svg */
  publicDir: path.resolve(__dirname, "assets/icons"),
  base: "./",
  /** Misma versión que `package.json`; evita depender solo de `app.getVersion()` en AppImage/Linux. */
  define: {
    __CATRIP_APP_VERSION__: JSON.stringify(typeof pkgVersion === "string" ? pkgVersion : "0.0.0"),
  },
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
