# Preview Generator

Lokalny generator podglądów stron dla firm lokalnych (fryzjer, barber, paznokcie, kosmetyczka, groomer).  
Z pliku JSON powstają **4 ostre PNG** (desktop + mobile) do wysłania w mailu. Strona nie jest publikowana — render dzieje się lokalnie przez Playwright (headless Chromium).

**Bez płatnych API.** Jedyny opcjonalny ruch sieciowy to darmowe Google Fonts przy pierwszym renderze (offline działa na fontach systemowych).

## Instalacja

```bash
cd preview-generator
npm install
npx playwright install chromium
```

## Użycie

Jeden plik:

```bash
npm run preview -- examples/fryzjer.json
```

Wynik: `out/<slug-firmy>/`

| Plik | Opis |
|------|------|
| `01-hero.png` | Desktop 1440×900, góra strony |
| `02-uslugi.png` | Sekcja usług i cennika |
| `03-opinie.png` | Opinie klientów |
| `04-mobile.png` | Telefon 390×844, góra strony |

Tryb wsadowy (wszystkie `*.json` w folderze):

```bash
npm run preview:batch -- data/
```

## Format JSON

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `name` | string | tak | Nazwa firmy |
| `industry` | string | tak | Identyfikator branży (`fryzjer`, …) |
| `city` | string | tak | Miasto |
| `address` | string | tak | Adres |
| `phone` | string | tak | Telefon |
| `hours` | `{ days, hours }[]` | tak | Godziny otwarcia |
| `services` | `{ name, price, duration?, description? }[]` | tak | Usługi i ceny |
| `reviews` | `{ author, text, rating }[]` | tak | Opinie (1–5) |
| `tagline` | string | nie | Krótki podtytuł w hero |
| `about` | string | nie | Opis salonu |
| `email` | string | nie | E-mail |
| `photos` | string[] | nie | URL lub ścieżki (opcjonalnie; bez zdjęć = gradienty/grafiki) |

Przykład: [`examples/fryzjer.json`](examples/fryzjer.json).

## Jak dodać nową branżę

1. Skopiuj `src/templates/fryzjer.ts` → np. `src/templates/barber.ts`.
2. Zmień `theme` (kolory, fonty, `id`, `label`) i ewentualnie układ HTML w `render…`.
3. Zarejestruj szablon w `src/templates/registry.ts`:

```ts
import { barberTheme, renderBarber } from "./barber.js";

const templates = {
  fryzjer: { theme: fryzjerTheme, render: renderFryzjer },
  barber: { theme: barberTheme, render: renderBarber },
};
```

4. Ustaw `"industry": "barber"` w JSON firmy i uruchom `npm run preview -- …`.

Sekcje z atrybutem `data-shot` (`hero`, `uslugi`, `opinie`) są wymagane — na ich podstawie Playwright robi zrzuty.
