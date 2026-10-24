import { neon } from "@neondatabase/serverless";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE = /^01[0125]\d{8}$/;
const ANSWER = new Set(["yes", "partial", "no", "unsure"]);
const ROLES = new Set(["both", "controller", "processor"]);
const FLAGS = ["sensitive", "children", "cloud", "mkt", "cctv", "web", "ai"];

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const normPhone = (v) => str(v, 40).replace(/[\s\-().]/g, "").replace(/^(\+|00)?20(?=1)/, "0");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const b = req.body && typeof req.body === "object" ? req.body : {};
  // "contact": the review form (email required). "download": the report gate (mobile required).
  const source = b.source === "download" ? "download" : "contact";
  const name = str(b.name, 120);
  const email = str(b.email, 200);
  const phone = normPhone(b.phone);
  const valid =
    name && b.consent === true && (!email || EMAIL.test(email)) && (!phone || MOBILE.test(phone)) &&
    (source === "download" ? phone : email);
  if (!valid) {
    return res.status(400).json({ error: "invalid_input" });
  }

  const p = b.profile && typeof b.profile === "object" ? b.profile : {};
  const profile = {
    company: str(p.company, 200),
    sector: str(p.sector, 20),
    records: Math.max(0, Math.min(Number.parseInt(p.records, 10) || 0, 1e12)),
    role: ROLES.has(p.role) ? p.role : "both",
  };
  for (const f of FLAGS) profile[f] = p[f] === true;

  const answers = {};
  if (b.answers && typeof b.answers === "object") {
    for (const [k, v] of Object.entries(b.answers)) {
      if (/^q\d{1,3}$/.test(k) && ANSWER.has(v)) answers[k] = v;
    }
  }
  const gaps = Array.isArray(b.gaps) ? b.gaps.filter((g) => typeof g === "string" && /^q\d{1,3}$/.test(g)).slice(0, 100) : [];
  const score = Math.max(0, Math.min(100, Math.round(Number(b.score) || 0)));

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO assessments (source, name, email, phone, company, sector, records, role, lang, score, gaps, profile, answers, consent, user_agent)
      VALUES (${source}, ${name}, ${email || null}, ${phone || null}, ${profile.company || null}, ${profile.sector}, ${profile.records},
              ${profile.role}, ${b.lang === "ar" ? "ar" : "en"}, ${score}, ${gaps}, ${JSON.stringify(profile)}::jsonb,
              ${JSON.stringify(answers)}::jsonb, true, ${str(req.headers["user-agent"], 300)})`;
    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("submit failed", err);
    return res.status(500).json({ error: "server_error" });
  }
}
