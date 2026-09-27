import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontDir = resolve(__dirname, "../public/fonts");
mkdirSync(fontDir, { recursive: true });

const cssUrl =
  // Fraunces is pinned to the single instance the headline uses (opsz 96,
  // wght 400). The variable face costs 67KB for one line of text; the static
  // instance is 16KB. Inter stays variable because it needs 400 and 500.
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@96,400&family=Inter:wght@400;500&display=swap";

// Inter is additionally subset to printable ASCII plus the typographic marks
// the site uses. Full latin is 48KB; this is 33KB. Anything outside the set
// falls back to the latin-ext face or the system sans.
export const INTER_SUBSET =
  Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join("") +
  "\u00b7\u00a9\u2014\u2013\u2019\u201c\u201d\u2192\u2026";

const ua =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const cssRes = await fetch(cssUrl, { headers: { "User-Agent": ua } });
let css = await cssRes.text();

const fontUrlRe = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g;
const fontUrls = [...css.matchAll(fontUrlRe)].map((m) => m[1]);

const seen = new Map();
for (const u of fontUrls) {
  if (seen.has(u)) continue;
  const name = u.split("/").slice(-2).join("-").replace(/\.woff2$/, ".woff2");
  const localName = name.replace(/^s-/, "");
  const res = await fetch(u);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(resolve(fontDir, localName), buf);
  seen.set(u, localName);
  css = css.replaceAll(u, `/fonts/${localName}`);
  console.log(`  ${localName}  ${buf.length} bytes`);
}

writeFileSync(resolve(fontDir, "fonts.css"), css);
console.log(`\nWrote ${seen.size} fonts + fonts.css`);
console.log("Preview of fonts.css head:\n" + css.slice(0, 400));
