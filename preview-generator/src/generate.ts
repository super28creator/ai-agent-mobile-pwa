import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, type Page } from "playwright";
import { compressPng } from "./compress.js";
import { toSlug } from "./slug.js";
import { renderBusinessHtml } from "./templates/registry.js";
import type { BusinessInput, GenerateResult } from "./types.js";

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  // Krótka pauza na layout po fontach (Google Fonts lokalnie cache’owane przez Chromium)
  await page.waitForTimeout(250);
}

async function shotSection(
  page: Page,
  selector: string,
  outPath: string,
  clip: { width: number; height: number }
): Promise<void> {
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(120);

  const box = await locator.boundingBox();
  if (!box) throw new Error(`Nie znaleziono sekcji: ${selector}`);

  // Zostajemy w granicach sekcji — szablony mają min-height pod kadr 1440×900.
  const y = Math.max(0, box.y);
  const height = Math.min(clip.height, Math.max(1, box.height));

  const png = await page.screenshot({
    type: "png",
    clip: { x: 0, y, width: clip.width, height },
  });

  const compressed = await compressPng(png);
  await writeFile(outPath, compressed);
}

async function shotViewport(page: Page, outPath: string): Promise<void> {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(80);
  const png = await page.screenshot({ type: "png" });
  const compressed = await compressPng(png);
  await writeFile(outPath, compressed);
}

export async function loadBusiness(jsonPath: string): Promise<BusinessInput> {
  const raw = await readFile(jsonPath, "utf8");
  const data = JSON.parse(raw) as BusinessInput;
  if (!data.name || !data.industry) {
    throw new Error(`Plik ${jsonPath} musi zawierać co najmniej "name" i "industry"`);
  }
  if (!Array.isArray(data.services) || data.services.length === 0) {
    throw new Error(`Plik ${jsonPath}: wymagana niepusta lista "services"`);
  }
  if (!Array.isArray(data.reviews) || data.reviews.length === 0) {
    throw new Error(`Plik ${jsonPath}: wymagana niepusta lista "reviews"`);
  }
  if (!Array.isArray(data.hours) || data.hours.length === 0) {
    throw new Error(`Plik ${jsonPath}: wymagana niepusta lista "hours"`);
  }
  return data;
}

export async function generatePreview(
  jsonPath: string,
  outRoot: string
): Promise<GenerateResult> {
  const business = await loadBusiness(jsonPath);
  const slug = toSlug(business.name);
  const outDir = path.join(outRoot, slug);
  await mkdir(outDir, { recursive: true });

  const html = renderBusinessHtml(business);
  const htmlPath = path.join(outDir, "preview.html");
  await writeFile(htmlPath, html, "utf8");

  const browser = await chromium.launch({ headless: true });
  const files: string[] = [];

  try {
    const desktop = await browser.newPage({
      viewport: DESKTOP,
      deviceScaleFactor: 2,
    });
    const fileUrl = pathToFileURL(htmlPath).href;
    await desktop.goto(fileUrl, { waitUntil: "networkidle" });
    await waitForFonts(desktop);

    const heroPath = path.join(outDir, "01-hero.png");
    await shotSection(desktop, '[data-shot="hero"]', heroPath, DESKTOP);
    files.push(heroPath);

    const uslugiPath = path.join(outDir, "02-uslugi.png");
    await shotSection(desktop, '[data-shot="uslugi"]', uslugiPath, DESKTOP);
    files.push(uslugiPath);

    const opiniePath = path.join(outDir, "03-opinie.png");
    await shotSection(desktop, '[data-shot="opinie"]', opiniePath, DESKTOP);
    files.push(opiniePath);

    await desktop.close();

    const mobile = await browser.newPage({
      viewport: MOBILE,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await mobile.goto(fileUrl, { waitUntil: "networkidle" });
    await waitForFonts(mobile);

    const mobilePath = path.join(outDir, "04-mobile.png");
    await shotViewport(mobile, mobilePath);
    files.push(mobilePath);
    await mobile.close();
  } finally {
    await browser.close();
  }

  return { slug, outDir, files };
}
