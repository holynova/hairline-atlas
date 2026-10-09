import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assemble, nameOf } from "../.agents/skills/hairline-create/build.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceDir = join(root, "src/figures");
const outputDir = join(root, "dist/figures");
mkdirSync(outputDir, { recursive: true });
const sources = readdirSync(sourceDir).filter((file) => file.endsWith(".js")).sort();
if (sources.length !== 9) throw new Error(`Expected 9 figures, found ${sources.length}`);
for (const file of sources) {
  const source = readFileSync(join(sourceDir, file), "utf8");
  const name = nameOf(source);
  if (!name) throw new Error(`Could not read figure name in ${file}`);
  writeFileSync(join(outputDir, `${name}.html`), assemble(source));
  console.log(`built ${name}.html`);
}
console.log(`built ${sources.length} standalone figures`);
