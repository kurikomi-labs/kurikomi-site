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

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F3ED"/>
  <g transform="translate(120, 200) scale(2.2)">
    ${logoSvg}
  </g>
  <text x="120" y="380" font-family="Georgia, serif" font-size="84" font-weight="500" fill="#0E0E0E" letter-spacing="-1.5">Kurikomi</text>
  <text x="120" y="450" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#6B6B6B">A small software company in Uzbekistan,</text>
  <text x="120" y="492" font-family="Helvetica, Arial, sans-serif" font-size="32" fill="#6B6B6B">shipping freely and quietly.</text>
  <rect x="120" y="552" width="64" height="2" fill="#6B4423"/>
  <text x="120" y="592" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#0E0E0E" letter-spacing="2">KURIKOMI.COM</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
  background: "#F7F3ED",
});

const png = resvg.render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
