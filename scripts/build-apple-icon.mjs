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

// Logo viewBox 153x230 — fit into 180x180 with padding. Target height 140px → scale 0.609. Width 93. Center x=43, y=20.
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="36" fill="#F7F3ED"/>
  <g transform="translate(43, 20) scale(0.609)" fill="#0E0E0E">
    ${inner}
  </g>
</svg>`;

const png = new Resvg(svg, { fitTo: { mode: "width", value: 180 } }).render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
