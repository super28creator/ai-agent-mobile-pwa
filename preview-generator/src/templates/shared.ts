import type { BusinessInput, ReviewItem } from "../types.js";
import type { IndustryTheme, TemplateContext } from "./types.js";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function stars(rating: number): string {
  const full = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(full) + "☆".repeat(5 - full);
}

export function defaultTagline(business: BusinessInput, theme: IndustryTheme): string {
  return business.tagline?.trim() || `${theme.label} w ${business.city}`;
}

export function defaultAbout(business: BusinessInput, theme: IndustryTheme): string {
  if (business.about?.trim()) return business.about.trim();
  return `${business.name} to ${theme.label.toLowerCase()} w ${business.city}. Dbamy o detale, jasną komunikację i efekt, który wygląda naturalnie na co dzień.`;
}

export function reviewCards(reviews: ReviewItem[]): string {
  return reviews
    .map(
      (r) => `
      <article class="review">
        <div class="review-top">
          <span class="review-stars" aria-label="Ocena ${r.rating} na 5">${stars(r.rating)}</span>
          <span class="review-author">${escapeHtml(r.author)}</span>
        </div>
        <p class="review-text">„${escapeHtml(r.text)}”</p>
      </article>`
    )
    .join("\n");
}

export function hoursRows(business: BusinessInput): string {
  return business.hours
    .map(
      (h) => `
      <div class="hours-row">
        <span>${escapeHtml(h.days)}</span>
        <span>${escapeHtml(h.hours)}</span>
      </div>`
    )
    .join("\n");
}

export function serviceRows(business: BusinessInput): string {
  return business.services
    .map((s) => {
      const meta = [s.duration, s.description].filter(Boolean).join(" · ");
      return `
      <li class="service">
        <div class="service-main">
          <h3>${escapeHtml(s.name)}</h3>
          ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
        </div>
        <div class="service-price">${escapeHtml(s.price)}</div>
      </li>`;
    })
    .join("\n");
}

/** Statyczna „mapa” jako SVG — zero zewnętrznych API. */
export function mapPlaceholder(address: string, city: string): string {
  const label = escapeHtml(`${address}`);
  return `
  <div class="map" role="img" aria-label="Mapa: ${label}">
    <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d9e0d6"/>
          <stop offset="100%" stop-color="#c5cfc8"/>
        </linearGradient>
        <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="#b7c2b8" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="640" height="360" fill="url(#mapGrad)"/>
      <rect width="640" height="360" fill="url(#grid)" opacity="0.55"/>
      <path d="M40 280 C120 220, 180 300, 260 240 S420 160, 520 210 S600 300, 620 260"
            fill="none" stroke="#8fa090" stroke-width="10" stroke-linecap="round" opacity="0.5"/>
      <path d="M0 180 C80 160, 140 200, 220 170 S360 120, 440 150 S560 190, 640 160"
            fill="none" stroke="#a8b5a9" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
      <circle cx="318" cy="168" r="18" fill="#1a1816"/>
      <circle cx="318" cy="168" r="8" fill="#fbf9f7"/>
      <rect x="170" y="292" width="300" height="44" rx="10" fill="#1a1816" opacity="0.88"/>
      <text x="320" y="319" text-anchor="middle" fill="#fbf9f7" font-family="system-ui,sans-serif" font-size="14">${escapeHtml(city)}</text>
    </svg>
  </div>`;
}

export function baseStyles(theme: IndustryTheme): string {
  const c = theme.colors;
  return `
:root {
  --bg: ${c.bg};
  --surface: ${c.surface};
  --text: ${c.text};
  --muted: ${c.muted};
  --accent: ${c.accent};
  --accent-soft: ${c.accentSoft};
  --line: ${c.line};
  --hero-from: ${c.heroFrom};
  --hero-to: ${c.heroTo};
  --display: ${theme.fontDisplay}, Georgia, serif;
  --body: ${theme.fontBody}, system-ui, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: auto; }
body {
  margin: 0;
  font-family: var(--body);
  color: var(--text);
  background: var(--bg);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
.wrap { width: min(1120px, calc(100% - 48px)); margin-inline: auto; }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  border: none;
  background: var(--accent);
  color: #fff;
  font: 600 15px/1 var(--body);
  letter-spacing: 0.01em;
  cursor: pointer;
}
.btn-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.35);
}
.section {
  padding: 88px 0;
}
.section-label {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin: 0 0 12px;
}
.section-title {
  font-family: var(--display);
  font-weight: 500;
  font-size: clamp(2rem, 3.4vw, 3rem);
  line-height: 1.12;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}
.section-lead {
  margin: 0;
  max-width: 36rem;
  color: var(--muted);
  font-size: 1.05rem;
}
`;
}

export function documentShell(ctx: TemplateContext, body: string, extraCss: string): string {
  const { business, theme } = ctx;
  const title = `${escapeHtml(business.name)} · ${escapeHtml(theme.label)}`;
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?${theme.fontsQuery}&display=swap" rel="stylesheet" />
  <style>
${baseStyles(theme)}
${extraCss}
  </style>
</head>
<body>
${body}
</body>
</html>`;
}
