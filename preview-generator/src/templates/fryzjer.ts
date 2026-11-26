import type { BusinessInput } from "../types.js";
import type { IndustryTheme, TemplateRenderer } from "./types.js";
import {
  defaultAbout,
  defaultTagline,
  documentShell,
  escapeHtml,
  hoursRows,
  mapPlaceholder,
  stars,
} from "./shared.js";

/**
 * Spójna, jasna estetyka atelier:
 * kamień + głęboki petrol, elegancka antykwa + czytelny sans.
 */
export const fryzjerTheme: IndustryTheme = {
  id: "fryzjer",
  label: "Salon fryzjerski",
  fontsQuery:
    "family=Cormorant:wght@500;600;700&family=Figtree:wght@400;500;600;700",
  fontDisplay: "Cormorant",
  fontBody: "Figtree",
  colors: {
    bg: "#F1EEE8",
    surface: "#FAF9F6",
    text: "#171513",
    muted: "#625E58",
    accent: "#1A4742",
    accentSoft: "#D5E4E0",
    line: "#D9D3C9",
    heroFrom: "#E8F0ED",
    heroTo: "#1A4742",
  },
};

function initials(author: string): string {
  const parts = author.replace(/\./g, " ").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function serviceMenu(business: BusinessInput): string {
  return business.services
    .map((s, i) => {
      const meta = [s.duration, s.description].filter(Boolean).join(" · ");
      const num = String(i + 1).padStart(2, "0");
      return `
      <li class="service">
        <span class="service-num">${num}</span>
        <div class="service-main">
          <h3>${escapeHtml(s.name)}</h3>
          ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
        </div>
        <span class="service-dots" aria-hidden="true"></span>
        <div class="service-price">${escapeHtml(s.price)}</div>
      </li>`;
    })
    .join("\n");
}

function reviewList(business: BusinessInput): string {
  return business.reviews
    .map(
      (r) => `
      <article class="review">
        <div class="review-top">
          <div class="avatar" aria-hidden="true">${escapeHtml(initials(r.author))}</div>
          <div>
            <div class="review-author">${escapeHtml(r.author)}</div>
            <div class="review-stars" aria-label="Ocena ${r.rating} na 5">${stars(r.rating)}</div>
          </div>
        </div>
        <p class="review-text">„${escapeHtml(r.text)}”</p>
      </article>`
    )
    .join("\n");
}

const css = `
.btn {
  border-radius: 8px;
  min-height: 52px;
  padding: 0 24px;
  background: var(--accent);
  color: #F6FBFA;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.btn-ghost {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line);
}
.btn-light {
  background: #F6FBFA;
  color: var(--accent);
}
.section { padding: 92px 0; }
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 12px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.section-label::before {
  content: "";
  width: 16px;
  height: 2px;
  background: var(--accent);
}
.section-title {
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(2.35rem, 4vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.025em;
  margin: 0 0 14px;
  max-width: 14ch;
}
.section-lead {
  margin: 0;
  max-width: 34rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.55;
}

.site-header {
  position: absolute;
  inset: 0 0 auto;
  z-index: 6;
  padding: 24px 0;
}
.site-header .wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.logo {
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  color: var(--text);
}
.nav {
  display: flex;
  align-items: center;
  gap: 26px;
  font-size: 0.94rem;
  font-weight: 600;
  color: rgba(246,251,250,0.82);
}
.nav a:hover { color: #F6FBFA; }
.nav-cta {
  color: var(--accent) !important;
  background: #F6FBFA;
  border-radius: 8px;
  padding: 11px 16px;
  font-size: 0.88rem;
}

.hero {
  position: relative;
  min-height: 900px;
  background: var(--bg);
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 54%;
  background:
    radial-gradient(ellipse 80% 50% at 20% 10%, rgba(26,71,66,0.06), transparent 60%),
    linear-gradient(180deg, #F7F5F0, var(--bg));
}
.hero-shell {
  position: relative;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  min-height: 900px;
  display: grid;
  grid-template-columns: 1fr 0.92fr;
  gap: 36px;
  align-items: stretch;
}
.hero-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 130px 8px 70px 0;
}
.hero-kicker {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
}
.hero h1 {
  margin: 0 0 20px;
  font-family: var(--display);
  font-weight: 600;
  font-size: clamp(3.6rem, 6.8vw, 5.6rem);
  line-height: 0.92;
  letter-spacing: -0.03em;
  color: var(--text);
  max-width: 9ch;
}
.hero-lead {
  margin: 0 0 32px;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--muted);
  max-width: 24rem;
  line-height: 1.45;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 34px;
}
.hero-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  max-width: 440px;
}
.hero-meta strong {
  display: block;
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 3px;
}
.hero-meta span {
  font-size: 0.86rem;
  color: var(--muted);
}

.hero-visual {
  position: relative;
  min-height: 900px;
  border-radius: 0 0 0 32px;
  background:
    radial-gradient(ellipse 65% 50% at 70% 28%, #3D7A72 0%, transparent 58%),
    linear-gradient(155deg, #245851 0%, #143936 48%, #0C2623 100%);
  overflow: hidden;
  box-shadow: -24px 0 60px rgba(20, 40, 36, 0.08);
}
.hero-visual svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-badge {
  position: absolute;
  left: 28px;
  right: 28px;
  bottom: 36px;
  z-index: 2;
  padding: 20px 22px;
  border-radius: 16px;
  background: rgba(250,249,246,0.96);
  color: var(--text);
}
.hero-badge strong {
  display: block;
  font-family: var(--display);
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.hero-badge span {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.45;
}

.mobile-visual {
  display: none;
}

.about {
  background: var(--surface);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.about-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 56px;
  align-items: center;
}
.about-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.stat {
  padding: 22px 18px;
  border-radius: 14px;
  background: var(--bg);
  border: 1px solid var(--line);
}
.stat strong {
  display: block;
  font-family: var(--display);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--accent);
  margin-bottom: 4px;
}
.stat span {
  color: var(--muted);
  font-size: 0.9rem;
}

.services {
  background: var(--bg);
  min-height: 900px;
  display: flex;
  align-items: center;
}
.services-head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: end;
  margin-bottom: 28px;
}
.service-panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: 18px;
  padding: 8px 28px;
}
.service-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.service {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 28px auto;
  gap: 10px;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid var(--line);
}
.service:last-child { border-bottom: none; }
.service-num {
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--accent);
}
.service h3 {
  margin: 0 0 2px;
  font-size: 1.08rem;
  font-weight: 700;
  letter-spacing: -0.015em;
}
.service p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}
.service-dots {
  height: 1px;
  border-bottom: 1px dotted rgba(23,21,19,0.25);
  align-self: center;
}
.service-price {
  font-family: var(--display);
  font-weight: 600;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
  color: var(--accent);
  white-space: nowrap;
  justify-self: end;
}

.reviews {
  background: var(--surface);
  min-height: 900px;
  display: flex;
  align-items: center;
  border-top: 1px solid var(--line);
}
.review-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 36px;
}
.review {
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 24px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.review-top {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #F6FBFA;
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}
.review-author {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 2px;
}
.review-stars {
  color: var(--accent);
  letter-spacing: 0.05em;
  font-size: 0.82rem;
}
.review-text {
  margin: 0;
  flex: 1;
  font-size: 1.02rem;
  line-height: 1.55;
  color: var(--text);
}

.contact {
  background: var(--accent);
  color: #E7F2EF;
}
.contact .section-label { color: #A7CFC7; }
.contact .section-label::before { background: #A7CFC7; }
.contact .section-title { color: #F6FBFA; max-width: 12ch; }
.contact .section-lead { color: rgba(246,251,250,0.78); }
.contact-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 20px;
  margin-top: 34px;
  align-items: stretch;
}
.contact-card {
  background: rgba(246,251,250,0.08);
  border: 1px solid rgba(246,251,250,0.14);
  border-radius: 18px;
  padding: 26px;
}
.contact-card h3 {
  margin: 0 0 14px;
  font-size: 0.82rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #A7CFC7;
}
.contact-line {
  margin: 0 0 14px;
  color: rgba(246,251,250,0.72);
}
.contact-line strong {
  display: block;
  color: #F6FBFA;
  margin-bottom: 2px;
  font-size: 1.02rem;
}
.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid rgba(246,251,250,0.14);
  font-size: 0.95rem;
  color: #F6FBFA;
}
.hours-row:last-child { border-bottom: none; }
.map {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(246,251,250,0.14);
  min-height: 360px;
  background: #C4D6D0;
}
.map svg { width: 100%; height: 100%; display: block; }

.site-footer {
  padding: 20px 0 28px;
  background: #0F2C29;
  color: rgba(246,251,250,0.6);
  font-size: 0.86rem;
}
.site-footer .wrap {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 980px) {
  .nav { display: none; }
  .hero { min-height: 844px; }
  .hero::before { width: 100%; }
  .hero-shell {
    width: min(1120px, calc(100% - 32px));
    grid-template-columns: 1fr;
    min-height: 844px;
    gap: 0;
  }
  .hero-visual { display: none; }
  .mobile-visual {
    display: block;
    margin: 0 0 28px;
    padding: 18px 18px;
    border-radius: 16px;
    background:
      radial-gradient(ellipse 80% 80% at 90% 0%, #3D7A72, transparent 55%),
      linear-gradient(135deg, #245851, #123532);
    color: #F6FBFA;
  }
  .mobile-visual strong {
    display: block;
    font-family: var(--display);
    font-size: 1.35rem;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .mobile-visual span {
    opacity: 0.82;
    font-size: 0.92rem;
    line-height: 1.4;
  }
  .hero-copy {
    padding: 100px 0 40px;
    justify-content: flex-end;
    min-height: 844px;
  }
  .hero h1 {
    max-width: 10ch;
    font-size: clamp(3rem, 13vw, 4rem);
  }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .hero-actions .btn { width: 100%; }
  .hero-meta { grid-template-columns: 1fr; max-width: none; }
  .about-grid,
  .services-head,
  .review-grid,
  .contact-grid { grid-template-columns: 1fr; }
  .services,
  .reviews { min-height: 0; display: block; }
  .section { padding: 64px 0; }
  .service {
    grid-template-columns: 34px minmax(0, 1fr);
  }
  .service-dots { display: none; }
  .service-price {
    grid-column: 2;
    justify-self: start;
    margin-top: 4px;
  }
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
        <a class="nav-cta" href="#kontakt">Umów wizytę</a>
      </nav>
    </div>
  </header>

  <section class="hero" data-shot="hero">
    <div class="hero-shell">
      <div class="hero-copy">
        <div class="mobile-visual" aria-hidden="true">
          <strong>Konsultacja w cenie</strong>
          <span>Dobieramy cięcie i kolor do codzienności — bez pośpiechu.</span>
        </div>
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
            <span>Adres salonu</span>
          </div>
          <div>
            <strong>${escapeHtml(business.hours[0]?.hours ?? "—")}</strong>
            <span>${escapeHtml(business.hours[0]?.days ?? "Godziny otwarcia")}</span>
          </div>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <svg viewBox="0 0 720 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#5AA197" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#0E2C29" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M90 0 C240 110, 160 250, 310 360 S560 430, 640 620 S500 860, 260 940"
                fill="none" stroke="rgba(246,251,250,0.14)" stroke-width="78" stroke-linecap="round"/>
          <path d="M20 80 C200 150, 120 300, 290 410 S560 500, 680 700"
                fill="none" stroke="rgba(246,251,250,0.09)" stroke-width="36" stroke-linecap="round"/>
          <circle cx="530" cy="200" r="160" fill="url(#sheen)"/>
          <circle cx="530" cy="200" r="102" fill="none" stroke="rgba(246,251,250,0.2)" stroke-width="1.5"/>
          <circle cx="530" cy="200" r="62" fill="none" stroke="rgba(246,251,250,0.32)" stroke-width="1.5"/>
        </svg>
        <div class="hero-badge">
          <strong>Konsultacja w cenie</strong>
          <span>Dobieramy cięcie i kolor do Twojej codzienności — bez pośpiechu.</span>
        </div>
      </div>
    </div>
  </section>

  <section class="section about">
    <div class="wrap about-grid">
      <div>
        <p class="section-label">O salonie</p>
        <h2 class="section-title">Dokładna praca w spokojnym tempie</h2>
        <p class="section-lead">${escapeHtml(about)}</p>
      </div>
      <div class="about-stats">
        <div class="stat"><strong>${business.services.length}</strong><span>usług w cenniku</span></div>
        <div class="stat"><strong>5.0</strong><span>średnia z opinii</span></div>
        <div class="stat"><strong>${escapeHtml(business.city)}</strong><span>lokalizacja salonu</span></div>
        <div class="stat"><strong>1:1</strong><span>opieka stylistki</span></div>
      </div>
    </div>
  </section>

  <section class="section services" id="uslugi" data-shot="uslugi">
    <div class="wrap">
      <div class="services-head">
        <div>
          <p class="section-label">Cennik</p>
          <h2 class="section-title">Usługi i jasne ceny</h2>
        </div>
        <p class="section-lead">Bez niespodzianek na miejscu. Czas to orientacyjna długość wizyty po krótkiej konsultacji.</p>
      </div>
      <div class="service-panel">
        <ul class="service-list">
          ${serviceMenu(business)}
        </ul>
      </div>
    </div>
  </section>

  <section class="section reviews" id="opinie" data-shot="opinie">
    <div class="wrap">
      <p class="section-label">Opinie</p>
      <h2 class="section-title">Głosy klientek</h2>
      <p class="section-lead">Konkretne doświadczenia z wizyt — nie generyczne hasła.</p>
      <div class="review-grid">
        ${reviewList(business)}
      </div>
    </div>
  </section>

  <section class="section contact" id="kontakt" data-shot="kontakt">
    <div class="wrap">
      <p class="section-label">Kontakt</p>
      <h2 class="section-title">Umów wizytę</h2>
      <p class="section-lead">Zadzwoń albo wpadnij osobiście. Pomożemy dobrać termin i zabieg.</p>
      <div class="contact-grid">
        <div class="contact-card">
          <h3>Salon</h3>
          <p class="contact-line"><strong>Adres</strong>${escapeHtml(business.address)}</p>
          <p class="contact-line"><strong>Telefon</strong><a href="tel:${escapeHtml(phoneHref)}">${escapeHtml(business.phone)}</a></p>
          ${
            business.email
              ? `<p class="contact-line"><strong>E-mail</strong><a href="mailto:${escapeHtml(business.email)}">${escapeHtml(business.email)}</a></p>`
              : ""
          }
          <h3 style="margin-top:26px">Godziny</h3>
          ${hoursRows(business)}
          <div style="margin-top:24px">
            <a class="btn btn-light" href="tel:${escapeHtml(phoneHref)}">Umów wizytę</a>
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
