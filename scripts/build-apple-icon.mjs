import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/apple-touch-icon.png");

const inner = readFileSync(resolve(__dirname, "../public/logo.svg"), "utf8")
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="36" fill="#F7F3ED"/>
  <g transform="translate(34, 34) scale(0.875)">
    ${inner}
  </g>
</svg>`;

const png = new Resvg(svg, { fitTo: { mode: "width", value: 180 } }).render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
