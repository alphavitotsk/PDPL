# PDPL Readiness Check

Bilingual (English / Arabic) self-assessment for Egypt's Personal Data Protection Law (Law 151/2020, ER Ministerial Decree 816/2025, PDPC guidelines v1.1). Built by Alphavito Technology Solutions.

- `public/index.html` — the app (static, no build step). Answers stay in the browser.
- `api/submit.js` — Vercel function. Stores a visitor's results in Neon **only** when they fill in the contact form and tick the consent box.
- `db/schema.sql` — Neon table (`assessments`).

## Deploy

- Vercel project `pdpl-readiness` (team mohamedtamim85): https://pdpl-readiness-mohamedtamim85.vercel.app
- Neon project `pdpl-readiness` (`morning-art-04146185`, AWS eu-central-1), table from `db/schema.sql`.
- Env var on Vercel: `DATABASE_URL` (Neon pooled connection string, marked sensitive).

The project is not linked to Git yet because the Vercel GitHub app has no access to `alphavitotsk`. Install it at
https://github.com/apps/vercel/installations/select_target and connect the repo in Vercel → Project → Settings → Git;
after that every push deploys automatically. Output directory: `public`, no build command.

Read submissions in the Neon SQL editor:

```sql
SELECT created_at, name, email, phone, company, score, records FROM assessments ORDER BY created_at DESC;
```
