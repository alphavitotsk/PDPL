# PDPL Readiness Check

Bilingual (English / Arabic) self-assessment for Egypt's Personal Data Protection Law (Law 151/2020, ER Ministerial Decree 816/2025, PDPC guidelines v1.1). Built by Alphavito Technology Solutions.

- `public/index.html` — the app (static, no build step). Answers stay in the browser.
- `api/submit.js` — Vercel function. Stores a visitor's results in Neon **only** when they fill in the contact form and tick the consent box.
- `db/schema.sql` — Neon table (`assessments`).

## Deploy

- Vercel project `pdpl-readiness` in the **alphavitotsk** account, linked to this repo. Every push to the
  production branch (`claude/nice-lamport-aqr9o9`, the repo default) deploys automatically.
- Settings: no framework, no build command, output directory `public`, functions in `fra1`.
- Env var: `DATABASE_URL` (Neon pooled connection string, marked sensitive).
- Neon project `pdpl-readiness` (`morning-art-04146185`, AWS eu-central-1), table from `db/schema.sql`.

Read submissions in the Neon SQL editor:

```sql
SELECT created_at, name, email, phone, company, score, records FROM assessments ORDER BY created_at DESC;
```
