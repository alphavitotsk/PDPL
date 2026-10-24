# PDPL Readiness Check

Bilingual (English / Arabic) self-assessment for Egypt's Personal Data Protection Law (Law 151/2020, ER Ministerial Decree 816/2025, PDPC guidelines v1.1). Built by Alphavito Technology Solutions.

- `public/index.html` — the app (static, no build step). Answers stay in the browser.
- `api/submit.js` — Vercel function. Stores a visitor's results in Neon **only** when they fill in the contact form and tick the consent box.
- `db/schema.sql` — Neon table (`assessments`).

## Deploy

Vercel project linked to this repo. Required env var: `DATABASE_URL` (Neon pooled connection string).

Read submissions in the Neon SQL editor:

```sql
SELECT created_at, name, email, phone, company, score, records FROM assessments ORDER BY created_at DESC;
```
