import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontDir = resolve(__dirname, "../public/fonts");
const cssPath = resolve(fontDir, "fonts.css");
let css = readFileSync(cssPath, "utf8");

// keep only latin + latin-ext blocks
const blockRe = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{[^}]+\}/g;
const kept = [];
const keptFiles = new Set();
let match;
while ((match = blockRe.exec(css))) {
  const subset = match[1];
  if (subset === "latin" || subset === "latin-ext") {
    kept.push(match[0]);
    const fileMatch = /url\(\/fonts\/([^)]+\.woff2)\)/.exec(match[0]);
    if (fileMatch) keptFiles.add(fileMatch[1]);
  }
}

writeFileSync(cssPath, kept.join("\n\n") + "\n");
console.log(`kept ${kept.length} blocks, ${keptFiles.size} fonts`);

// delete unused woff2 files
let removed = 0;
for (const f of readdirSync(fontDir)) {
  if (!f.endsWith(".woff2")) continue;
  if (!keptFiles.has(f)) {
    unlinkSync(resolve(fontDir, f));
    removed++;
  }
}
console.log(`removed ${removed} unused woff2 files`);
console.log(`kept files:`, [...keptFiles].sort());
