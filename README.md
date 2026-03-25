# AI Agent — PWA (Vercel)

Statyczna PWA. **Brak sekretów w repozytorium.**

- Backend działa na Twoim PC: `agent_dashboard.py` + tunel HTTPS.
- **Build:** `npm run build` → wynik w `vercel/out` (skrypt `vercel/build.mjs` wstawia `mobile_app.html` + `api-base.js`).
- Opcjonalnie w Vercel: zmienna **`AIA_API_BASE`** = origin tunelu — wtedy często wystarczy sam kod parowania.

## Deploy (Vercel + GitHub)

- **Root Directory:** (puste, root repo)
- **Build:** `npm run build`
- **Output:** `vercel/out`

Po każdym `git push` na `master` Vercel robi nowy deploy (jeśli projekt jest podpięty do tego repo).
