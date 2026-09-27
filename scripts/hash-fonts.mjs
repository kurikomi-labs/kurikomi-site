import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, renameSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

// Fonts are served immutable for a year at a stable path, so replacing one
// leaves returning visitors on the old file until their cache expires. Adding
// a content hash to the filename makes each revision a new URL.

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../dist");
const fontDir = join(dist, "fonts");

const rewritable = readdirSync(dist, { recursive: true })
  .filter((f) => /\.(html|css|js)$/.test(f))
  .map((f) => join(dist, f));

const renames = [];

for (const file of readdirSync(fontDir)) {
  if (!file.endsWith(".woff2")) continue;
  const full = join(fontDir, file);
  const buf = readFileSync(full);
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 8);
  const base = file.replace(/\.woff2$/, "");
  const hashed = `${base}.${hash}.woff2`;
  renameSync(full, join(fontDir, hashed));
  renames.push([`/fonts/${file}`, `/fonts/${hashed}`]);
}

let touched = 0;
for (const file of rewritable) {
  const before = readFileSync(file, "utf8");
  let after = before;
  for (const [from, to] of renames) after = after.split(from).join(to);
  if (after !== before) {
    writeFileSync(file, after);
    touched++;
  }
}

// A font nobody references is a silent 404 waiting to happen.
const html = readFileSync(join(dist, "index.html"), "utf8");
const orphans = renames.filter(([, to]) => !html.includes(to)).map(([from]) => from);

for (const [from, to] of renames) console.log(`  ${from} -> ${to}`);
console.log(`Rewrote ${touched} file(s).`);
if (orphans.length) console.log(`Note: not referenced from index.html: ${orphans.join(", ")}`);
