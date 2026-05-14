import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontDir = resolve(__dirname, "../public/fonts");
mkdirSync(fontDir, { recursive: true });

const cssUrl =
  "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@400;500&display=swap";

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
