import type { IndustryTheme, TemplateRenderer } from "./types.js";
import {
  defaultAbout,
  defaultTagline,
  documentShell,
  escapeHtml,
  hoursRows,
  mapPlaceholder,
  reviewCards,
  serviceRows,
} from "./shared.js";

/** Paleta: ciepły grafit + zgaszony różowiec + mięta papierowa — bez fioletu i kremowo-terrakotowego klisza. */
export const fryzjerTheme: IndustryTheme = {
  id: "fryzjer",
  label: "Salon fryzjerski",
  fontsQuery: "family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600;700",
  fontDisplay: '"Instrument Serif"',
  fontBody: "Manrope",
  colors: {
    bg: "#F6F3EE",
    surface: "#FFFCFA",
    text: "#1C1917",
    muted: "#6B645C",
    accent: "#8F4E56",
    accentSoft: "#F0E2E3",
    line: "#E5DED4",
    heroFrom: "#2A2421",
    heroTo: "#5C3D42",
  },
};

const css = `
.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 5;
  padding: 22px 0;
}
.site-header .wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.logo {
  font-family: var(--display);
  font-size: 1.2rem;
  color: #fff;
  letter-spacing: -0.01em;
  opacity: 0.92;
}
.nav {
  display: flex;
  gap: 22px;
  color: rgba(255,255,255,0.78);
  font-size: 0.92rem;
  font-weight: 500;
}
.nav a:hover { color: #fff; }

.hero {
  position: relative;
  min-height: 900px;
  display: flex;
  align-items: flex-end;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(ellipse 80% 60% at 72% 18%, rgba(143,78,86,0.42), transparent 58%),
    radial-gradient(ellipse 48% 42% at 12% 82%, rgba(90,110,96,0.28), transparent 52%),
    linear-gradient(148deg, var(--hero-from) 0%, #3a2c2a 48%, var(--hero-to) 100%);
}
.hero-art {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-art svg { width: 100%; height: 100%; }
.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 0 88px;
  width: 100%;
}
.hero-kicker {
  display: inline-block;
  margin: 0 0 20px;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
  color: rgba(255,255,255,0.7);
}
.hero h1 {
  margin: 0 0 20px;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(3.4rem, 7.2vw, 5.6rem);
  line-height: 0.96;
  letter-spacing: -0.03em;
  max-width: 10ch;
}
.hero-lead {
  margin: 0 0 34px;
  max-width: 30rem;
  font-size: 1.12rem;
  color: rgba(255,255,255,0.84);
}
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-meta {
  margin-top: 44px;
  padding-top: 22px;
  border-top: 1px solid rgba(255,255,255,0.14);
  display: flex;
  flex-wrap: wrap;
  gap: 36px;
  color: rgba(255,255,255,0.68);
  font-size: 0.9rem;
}
.hero-meta strong { color: #fff; font-weight: 600; display: block; margin-bottom: 3px; }

.about {
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}
.about-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}
.about-panel {
  min-height: 280px;
  border-radius: 28px;
  background:
    linear-gradient(160deg, var(--accent-soft), #E8EEE6 55%, #DDD4C8);
  position: relative;
  overflow: hidden;
}
.about-panel::after {
  content: "";
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  right: -40px;
  bottom: -50px;
  background: rgba(143,78,86,0.18);
}
.about-panel::before {
  content: "";
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  left: 36px;
  top: 40px;
  border: 1px solid rgba(28,25,23,0.12);
}

.services {
  background: var(--bg);
  min-height: 900px;
  display: flex;
  align-items: center;
}
.service-list {
  list-style: none;
  margin: 36px 0 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.service {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: baseline;
  padding: 22px 0;
  border-bottom: 1px solid var(--line);
}
.service h3 {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.service p {
  margin: 0;
  color: var(--muted);
  font-size: 0.95rem;
}
.service-price {
  font-family: var(--display);
  font-size: 1.45rem;
  white-space: nowrap;
}

.reviews {
  background: var(--surface);
  min-height: 900px;
  display: flex;
  align-items: center;
}
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 40px;
}
.review {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 26px;
  min-height: 240px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.review-top {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.review-stars {
  color: var(--accent);
  letter-spacing: 0.08em;
  font-size: 0.95rem;
}
.review-author {
  font-weight: 700;
  font-size: 0.95rem;
}
.review-text {
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.6;
}

.contact { background: var(--bg); }
.contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  margin-top: 36px;
  align-items: stretch;
}
.contact-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 28px;
}
.contact-card h3 {
  margin: 0 0 18px;
  font-size: 1.1rem;
}
.contact-line {
  margin: 0 0 14px;
  color: var(--muted);
}
.contact-line strong {
  display: block;
  color: var(--text);
  margin-bottom: 2px;
}
.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.95rem;
}
.hours-row:last-child { border-bottom: none; }
.map {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--line);
  height: 100%;
  min-height: 320px;
  background: #d5ddd3;
}
.map svg { width: 100%; height: 100%; display: block; }

.site-footer {
  padding: 28px 0 40px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.9rem;
}
.site-footer .wrap {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .nav { display: none; }
  .about-grid,
  .review-grid,
  .contact-grid { grid-template-columns: 1fr; }
  .hero { min-height: 844px; }
  .services,
  .reviews { min-height: 0; display: block; }
  .hero-content { padding-bottom: 56px; }
  .hero h1 { max-width: 11ch; font-size: clamp(2.7rem, 12vw, 3.7rem); }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { width: 100%; }
  .hero-meta { gap: 18px; }
  .section { padding: 64px 0; }
  .wrap { width: min(1120px, calc(100% - 32px)); }
}
`;

export const renderFryzjer: TemplateRenderer = (ctx) => {
  const { business, theme } = ctx;
  const tagline = defaultTagline(business, theme);
  const about = defaultAbout(business, theme);
  const phoneHref = business.phone.replace(/\s+/g, "");

  const body = `
  <header class="site-header">
    <div class="wrap">
      <div class="logo">${escapeHtml(business.name)}</div>
      <nav class="nav" aria-label="Sekcje">
        <a href="#uslugi">Usługi</a>
        <a href="#opinie">Opinie</a>
        <a href="#kontakt">Kontakt</a>
      </nav>
    </div>
  </header>

  <section class="hero" data-shot="hero">
    <div class="hero-art" aria-hidden="true">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.2">
          <circle cx="1080" cy="220" r="180"/>
          <circle cx="1080" cy="220" r="260"/>
          <circle cx="1080" cy="220" r="340"/>
        </g>
        <path d="M0 620 C220 540, 380 720, 560 640 S880 480, 1100 560 S1320 720, 1440 680 L1440 900 L0 900 Z"
              fill="rgba(0,0,0,0.18)"/>
      </svg>
    </div>
    <div class="hero-content">
      <div class="wrap">
        <p class="hero-kicker">${escapeHtml(theme.label)} · ${escapeHtml(business.city)}</p>
        <h1>${escapeHtml(business.name)}</h1>
        <p class="hero-lead">${escapeHtml(tagline)}</p>
        <div class="hero-actions">
          <a class="btn" href="#kontakt">Umów wizytę</a>
          <a class="btn btn-ghost" href="tel:${escapeHtml(phoneHref)}">${escapeHtml(business.phone)}</a>
        </div>
        <div class="hero-meta">
          <div>
            <strong>${escapeHtml(business.address)}</strong>
            Adres salonu
          </div>
          <div>
            <strong>${escapeHtml(business.hours[0]?.hours ?? "—")}</strong>
            ${escapeHtml(business.hours[0]?.days ?? "Godziny otwarcia")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section about">
    <div class="wrap about-grid">
      <div>
        <p class="section-label">O salonie</p>
        <h2 class="section-title">Spokojna przestrzeń, dokładna praca</h2>
        <p class="section-lead">${escapeHtml(about)}</p>
      </div>
      <div class="about-panel" aria-hidden="true"></div>
    </div>
  </section>

  <section class="section services" id="uslugi" data-shot="uslugi">
    <div class="wrap">
      <p class="section-label">Cennik</p>
      <h2 class="section-title">Usługi dopasowane do włosa</h2>
      <p class="section-lead">Jasne ceny, bez niespodzianek. Czas trwania to orientacyjna długość wizyty po konsultacji.</p>
      <ul class="service-list">
        ${serviceRows(business)}
      </ul>
    </div>
  </section>

  <section class="section reviews" id="opinie" data-shot="opinie">
    <div class="wrap">
      <p class="section-label">Opinie</p>
      <h2 class="section-title">Co mówią klientki</h2>
      <p class="section-lead">Krótkie, konkretne doświadczenia — bez generycznych haseł.</p>
      <div class="review-grid">
        ${reviewCards(business.reviews)}
      </div>
    </div>
  </section>

  <section class="section contact" id="kontakt" data-shot="kontakt">
    <div class="wrap">
      <p class="section-label">Kontakt</p>
      <h2 class="section-title">Umów wizytę</h2>
      <p class="section-lead">Zadzwoń lub wpadnij osobiście. Chętnie doradzimy termin i zabieg.</p>
      <div class="contact-grid">
        <div class="contact-card">
          <h3>Dane salonu</h3>
          <p class="contact-line"><strong>Adres</strong>${escapeHtml(business.address)}</p>
          <p class="contact-line"><strong>Telefon</strong><a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(business.phone)}</a></p>
          ${
            business.email
              ? `<p class="contact-line"><strong>E-mail</strong><a href="mailto:${escapeHtml(business.email)}">${escapeHtml(business.email)}</a></p>`
              : ""
          }
          <h3 style="margin-top:28px">Godziny otwarcia</h3>
          ${hoursRows(business)}
          <div style="margin-top:24px">
            <a class="btn" href="tel:${escapeHtml(phoneHref)}">Umów wizytę</a>
          </div>
        </div>
        ${mapPlaceholder(business.address, business.city)}
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="wrap">
      <span>${escapeHtml(business.name)} · ${escapeHtml(business.city)}</span>
      <span>Podgląd strony — materiał przykładowy</span>
    </div>
  </footer>
  `;

  return documentShell(ctx, body, css);
};
