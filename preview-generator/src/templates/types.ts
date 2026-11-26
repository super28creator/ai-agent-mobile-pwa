import type { BusinessInput } from "../types.js";

export interface IndustryTheme {
  /** Unikalny identyfikator branży */
  id: string;
  /** Etykieta widoczna w UI (np. „Salon fryzjerski”) */
  label: string;
  /** Google Fonts family query (bez „family=”) */
  fontsQuery: string;
  fontDisplay: string;
  fontBody: string;
  colors: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    line: string;
    heroFrom: string;
    heroTo: string;
  };
}

export interface TemplateContext {
  business: BusinessInput;
  theme: IndustryTheme;
  resolvedPhotos: string[];
}

export type TemplateRenderer = (ctx: TemplateContext) => string;
