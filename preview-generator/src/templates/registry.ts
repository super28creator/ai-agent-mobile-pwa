import type { BusinessInput } from "../types.js";
import { fryzjerTheme, renderFryzjer } from "./fryzjer.js";
import type { IndustryTheme, TemplateContext, TemplateRenderer } from "./types.js";

interface TemplateEntry {
  theme: IndustryTheme;
  render: TemplateRenderer;
}

/**
 * Rejestr branż. Aby dodać nową:
 * 1. Utwórz plik `src/templates/<branża>.ts` (theme + render)
 * 2. Zarejestruj poniżej
 */
const templates: Record<string, TemplateEntry> = {
  fryzjer: { theme: fryzjerTheme, render: renderFryzjer },
};

export function listIndustries(): string[] {
  return Object.keys(templates);
}

export function getTemplate(industry: string): TemplateEntry {
  const key = industry.trim().toLowerCase();
  const entry = templates[key];
  if (!entry) {
    const known = listIndustries().join(", ");
    throw new Error(`Nieznana branża: "${industry}". Dostępne: ${known || "(brak)"}`);
  }
  return entry;
}

export function renderBusinessHtml(business: BusinessInput): string {
  const { theme, render } = getTemplate(String(business.industry));
  const ctx: TemplateContext = {
    business,
    theme,
    resolvedPhotos: business.photos ?? [],
  };
  return render(ctx);
}
