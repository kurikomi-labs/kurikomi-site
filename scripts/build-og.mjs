import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/og.png");

const VOID = "#0a0908";
const BONE = "#e9e3d8";
const ASH = "#8b8379";
const BRASS = "#cf9a52";
const BRASS_HI = "#f2cd91";

const logoSvg = readFileSync(resolve(__dirname, "../public/logo.svg"), "utf8")
  .replace(/<\?xml[^?]*\?>/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "");

// Orrery echo on the right: the same squashed ellipses the page draws, with
// orbit VI picked out in brass. cx/cy and the axes are authored in final
// pixels, so this stays in step with the page without sharing its code.
const SUN_X = 880;
const SUN_Y = 315;
const SQUASH = 0.342;
const ORBITS = [46, 68, 91, 116, 143, 172, 202, 235, 269, 305, 343, 383];
const LIVE = 5;

const rings = ORBITS.map((a, i) =>
  i === LIVE
    ? `<ellipse cx="0" cy="0" rx="${a}" ry="${a * SQUASH}" fill="none" stroke="${BRASS}" stroke-opacity="0.55" stroke-width="1.6"/>`
    : `<ellipse cx="0" cy="0" rx="${a}" ry="${a * SQUASH}" fill="none" stroke="${BONE}" stroke-opacity="0.16" stroke-width="1.4" stroke-dasharray="2.5 8"/>`
).join("\n    ");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="field" cx="0.73" cy="0.5" r="0.62">
      <stop offset="0" stop-color="#16130f"/>
      <stop offset="0.55" stop-color="#0d0b09"/>
      <stop offset="1" stop-color="${VOID}"/>
    </radialGradient>
    <radialGradient id="corona" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${BRASS}" stop-opacity="0.34"/>
      <stop offset="0.42" stop-color="${BRASS}" stop-opacity="0.11"/>
      <stop offset="1" stop-color="${BRASS}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="body" cx="0.36" cy="0.3" r="0.72">
      <stop offset="0" stop-color="${BRASS_HI}"/>
      <stop offset="0.5" stop-color="${BRASS}"/>
      <stop offset="1" stop-color="#8a5f2c"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#field)"/>

  <g transform="translate(${SUN_X} ${SUN_Y})">
    ${rings}
    <circle cx="0" cy="0" r="150" fill="url(#corona)"/>
    <g transform="translate(-20 -30) scale(0.26)" fill="${BRASS}">
      ${logoSvg}
    </g>
    <circle cx="${-ORBITS[LIVE] * 0.94}" cy="${-ORBITS[LIVE] * SQUASH * 0.34}" r="11" fill="url(#body)"/>
  </g>

  <g transform="translate(96 144)" fill="${BONE}">
    <g transform="scale(0.30)">
      ${logoSvg}
    </g>
  </g>

  <text x="150" y="212" font-family="Georgia, serif" font-size="82" font-weight="500" fill="${BONE}" letter-spacing="-1.5">Kurikomi</text>
  <text x="96" y="300" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="${ASH}">An independent software company</text>
  <text x="96" y="342" font-family="Helvetica, Arial, sans-serif" font-size="29" fill="${ASH}">in Bukhara, Uzbekistan.</text>
  <rect x="96" y="398" width="56" height="2" fill="${BRASS}"/>
  <text x="96" y="436" font-family="Helvetica, Arial, sans-serif" font-size="21" fill="${BONE}" letter-spacing="2">KURIKOMI.COM</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { loadSystemFonts: true, defaultFontFamily: "Helvetica" },
  background: VOID,
});

const png = resvg.render().asPng();
writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${png.length} bytes)`);
