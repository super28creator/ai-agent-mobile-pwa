import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generatePreview } from "./generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const defaultOut = path.join(root, "out");

function printHelp(): void {
  console.log(`Użycie:
  npm run preview -- <plik.json>
  npm run preview:batch -- <folder-z-json>

Przykłady:
  npm run preview -- examples/fryzjer.json
  npm run preview:batch -- data/
`);
}

async function collectJsonFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => path.join(dir, e.name))
    .sort();
}

async function main(): Promise<void> {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const batch = args[0] === "--batch";
  const target = batch ? args[1] : args[0];
  if (!target) {
    printHelp();
    process.exit(1);
  }

  const resolved = path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);

  if (batch) {
    const files = await collectJsonFiles(resolved);
    if (files.length === 0) {
      console.error(`Brak plików JSON w: ${resolved}`);
      process.exit(1);
    }
    console.log(`Wsadowo: ${files.length} plik(ów) z ${resolved}`);
    for (const file of files) {
      console.log(`\n→ ${path.basename(file)}`);
      const result = await generatePreview(file, defaultOut);
      for (const f of result.files) {
        console.log(`  ${path.relative(root, f)}`);
      }
    }
    return;
  }

  const result = await generatePreview(resolved, defaultOut);
  console.log(`Gotowe: ${result.outDir}`);
  for (const f of result.files) {
    console.log(`  ${path.relative(root, f)}`);
  }
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
