/**
 * Buduje statyczny front PWA do wrzucenia na Vercel.
 * API agenta musi działać na Twoim PC (tunel / stały host) — adres ustawiasz w
 * zmiennej środowiskowej AIA_API_BASE (opcjonalnie) albo w polu w aplikacji.
 *
 * Deploy: w panelu Vercel ustaw Root Directory na (puste) — root repozytorium,
 * żeby w archiwum były mobile_app.html i mobile_sw.js (folder „vercel” sam w sobie
 * ich nie zawiera; sam deploy z podfolderu kończy się błędem ENOENT przy buildzie).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "..");
const out = path.join(__dirname, "out");

fs.mkdirSync(out, { recursive: true });

let html = fs.readFileSync(path.join(repoRoot, "mobile_app.html"), "utf8");
if (!html.includes("api-base.js")) {
    html = html.replace(
        "<head>",
        "<head>\n<script src=\"/api-base.js\"></script>",
    );
}
fs.writeFileSync(path.join(out, "index.html"), html);

const manifest = {
    name: "AI Agent",
    short_name: "AI Agent",
    description: "AI Agent — mobilny companion",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
        {
            src: "/icon-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any maskable",
        },
        {
            src: "/icon-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
        },
    ],
};
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));

fs.copyFileSync(path.join(repoRoot, "mobile_sw.js"), path.join(out, "sw.js"));
fs.copyFileSync(path.join(__dirname, "icon-192.svg"), path.join(out, "icon-192.svg"));
fs.copyFileSync(path.join(__dirname, "icon-512.svg"), path.join(out, "icon-512.svg"));

const rawBase = (process.env.AIA_API_BASE || "").trim().replace(/\/+$/, "");
let apiBase = "";
if (rawBase) {
    try {
        const u = new URL(rawBase.startsWith("http") ? rawBase : `https://${rawBase}`);
        apiBase = u.origin;
    } catch {
        console.warn("build.mjs: niepoprawne AIA_API_BASE, pomijam");
    }
}
fs.writeFileSync(
    path.join(out, "api-base.js"),
    `window.__AIA_API_BASE__=${JSON.stringify(apiBase)};`,
);

console.log("vercel/out gotowe:", apiBase ? `AIA_API_BASE=${apiBase}` : "AIA_API_BASE=(puste — ustaw w UI lub env)");
