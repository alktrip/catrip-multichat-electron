import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");
const svgPath = path.join(projectRoot, "assets", "icons", "org.k3p.catrip-multichat.svg");
const outDir = path.join(projectRoot, "assets", "icons");

const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

await mkdir(outDir, { recursive: true });

const svg = await readFile(svgPath);

for (const size of sizes) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "transparent",
  });
  const pngData = resvg.render().asPng();
  const outPath = path.join(outDir, `${size}x${size}.png`);
  await writeFile(outPath, pngData);
  // eslint-disable-next-line no-console
  console.log(`Wrote ${path.relative(projectRoot, outPath)}`);
}
