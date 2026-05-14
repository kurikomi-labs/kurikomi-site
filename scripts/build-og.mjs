import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/og.png");

const logoSvg = readFileSync(resolve(__dirname, "../public/logo.svg"), "utf8")
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "");

// Logo viewBox 153x230 — scale to 220px tall, position at x=120, y=120
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F3ED"/>
  <g transform="translate(120, 120) scale(0.957)" fill="#0E0E0E">
    ${logoSvg}
  </g>
  <text x="320" y="180" font-family="Georgia, serif" font-size="92" font-weight="500" fill="#0E0E0E" letter-spacing="-1.5">Kurikomi</text>
  <text x="320" y="240" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#6B6B6B">An independent software company</text>
  <text x="320" y="282" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#6B6B6B">based in Uzbekistan.</text>
  <rect x="320" y="335" width="60" height="2" fill="#6B4423"/>
  <text x="320" y="372" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#0E0E0E" letter-spacing="2">KURIKOMI.COM</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
  background: "#F7F3ED",
});

const png = resvg.render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
