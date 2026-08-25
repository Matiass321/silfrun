-- Silfrún — admin schema.
--
-- Apply with:
--   npm run db:migrate:local     (development)
--   npm run db:migrate:remote    (production)
--
-- Cleaning only. There is no equipment rental here, so there are no machines,
-- no reservations, no turnaround windows and no condition records. A visit has
-- an address and a list of items; that is the whole model.
--
-- Times are unix seconds (UTC). Iceland sits on UTC year round and does not
-- observe daylight saving, so local time and stored time agree — but they are
-- still stored as UTC so that stays true if the business ever works abroad.

-- ---------------------------------------------------------------------------
-- Customers.
--
-- Phone is the identity, not email: enquiries arrive on WhatsApp, and a
-- household that has never given an email address is the normal case rather
-- than the exception.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  phone       TEXT NOT NULL,
  email       TEXT,
  area        TEXT,
  notes       TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS customers_phone ON customers (phone);

-- ---------------------------------------------------------------------------
-- Visits.
--
-- `window` is morning/afternoon rather than an exact time. A cleaning visit
-- runs long or short depending on what is found, and promising 14:00 exactly
-- is how you end up late for the next household.
--
-- There is no price on the row until one is agreed. The service is quoted from
-- photographs, so a visit starts life as a request for a time — the figure is
-- settled on WhatsApp before anyone drives anywhere. `quote_isk` is whole
-- krónur: Iceland has no subunit in circulation, so storing cents would invent
-- a precision that does not exist.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visits (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  ref            TEXT NOT NULL UNIQUE,             -- 'S-0001'
  customer_id    INTEGER NOT NULL REFERENCES customers(id),

  preferred_date TEXT NOT NULL,                    -- 'YYYY-MM-DD'
  window         TEXT NOT NULL DEFAULT 'morning'
                   CHECK (window IN ('morning', 'afternoon', 'either')),
  scheduled_at   INTEGER,                          -- set once staff fix a time

  items          TEXT NOT NULL DEFAULT '[]',       -- JSON array of service keys
  address        TEXT,
  area           TEXT,
  notes          TEXT,

  status         TEXT NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','quoted','scheduled','done','cancelled')),
  quote_isk      INTEGER,
  locale         TEXT,

  created_at     INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS visits_status ON visits (status, preferred_date);
CREATE INDEX IF NOT EXISTS visits_customer ON visits (customer_id);
CREATE INDEX IF NOT EXISTS visits_scheduled ON visits (scheduled_at) WHERE scheduled_at IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Reminders.
--
-- Generated from visits, then sent. Storing them rather than computing on the
-- fly is what makes "sent" durable: without a record a reminder either never
-- goes out, or goes out again every time somebody opens the page.
--
-- The UNIQUE index on (kind, subject) is the guard — the same reminder can
-- only ever exist once, so a repeated generation run is a no-op instead of a
-- second message to a customer.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reminders (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  kind         TEXT NOT NULL,                      -- 'visit_tomorrow'
  subject      TEXT NOT NULL,                      -- the visit ref
  customer_id  INTEGER REFERENCES customers(id),
  due_at       INTEGER NOT NULL,
  channel      TEXT NOT NULL DEFAULT 'whatsapp',
  body         TEXT NOT NULL,
  sent_at      INTEGER,
  sent_by      TEXT,
  dismissed_at INTEGER,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE UNIQUE INDEX IF NOT EXISTS reminders_unique ON reminders (kind, subject);
CREATE INDEX IF NOT EXISTS reminders_due ON reminders (due_at) WHERE sent_at IS NULL;

-- ---------------------------------------------------------------------------
-- Settings.
--
-- Holds the admin password hash, so the first run can be completed from a
-- browser. A Worker cannot write its own Cloudflare secrets, so without this
-- a terminal would be the only way to set a password.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- ---------------------------------------------------------------------------
-- Login throttle.
--
-- In D1 rather than KV because a rate limiter has to read its own writes. KV
-- is eventually consistent, so attempts fired faster than the reads converge
-- would slip straight past it.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS throttle (
  key   TEXT PRIMARY KEY,
  n     INTEGER NOT NULL,
  reset INTEGER NOT NULL
);
