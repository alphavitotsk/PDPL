-- Opt-in submissions from the PDPL Readiness Check.
CREATE TABLE IF NOT EXISTS assessments (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  source      TEXT NOT NULL DEFAULT 'contact',  -- 'contact' form or 'download' gate
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  company     TEXT,
  sector      TEXT,
  records     BIGINT,
  role        TEXT,
  lang        TEXT,
  score       INTEGER,
  gaps        TEXT[],
  profile     JSONB NOT NULL,
  answers     JSONB NOT NULL,
  consent     BOOLEAN NOT NULL CHECK (consent),
  CHECK (email IS NOT NULL OR phone IS NOT NULL),
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS assessments_created_at_idx ON assessments (created_at DESC);
CREATE INDEX IF NOT EXISTS assessments_email_idx ON assessments (lower(email));
