-- Analytics and newsletter.
--
-- Apply with:
--   npx wrangler d1 execute silfrun --remote --file=./db/migrations/0001_analytics_and_newsletter.sql

-- ---------------------------------------------------------------------------
-- Events.
--
-- Deliberately anonymous. No IP address, no cookie, no identifier of any kind
-- is stored, so nothing here can be tied back to a person and no consent
-- banner is required to collect it — which is also why there is no banner on
-- the site.
--
-- `day` is denormalised from created_at because every chart groups by it, and
-- an index on a stored date column is far cheaper than date() on every row.
--
-- country and device are coarse on purpose: 'IS' and 'mobile' answer the
-- questions the business actually has without approaching a fingerprint.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  kind       TEXT NOT NULL,          -- 'view' | 'whatsapp' | 'messenger' | 'call' | 'email' | 'booking'
  path       TEXT,                   -- '/is/sofahreinsun/'
  locale     TEXT,                   -- 'is' | 'en'
  referrer   TEXT,                   -- host only, never the full URL
  country    TEXT,                   -- two-letter, from Cloudflare
  device     TEXT,                   -- 'mobile' | 'desktop'
  day        TEXT NOT NULL,          -- 'YYYY-MM-DD', Reykjavík
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS events_day   ON events (day, kind);
CREATE INDEX IF NOT EXISTS events_kind  ON events (kind, created_at);
CREATE INDEX IF NOT EXISTS events_path  ON events (path, day);

-- ---------------------------------------------------------------------------
-- Newsletter subscribers.
--
-- Double opt-in. `confirmed_at` stays null until the person clicks the link in
-- the confirmation email, and nothing is ever sent to an unconfirmed address:
-- under GDPR a bare form submission is not consent, and a list built without
-- it cannot lawfully be mailed.
--
-- `token` is used for both confirming and unsubscribing, so an unsubscribe
-- link never needs the person to log in or identify themselves.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscribers (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  email          TEXT NOT NULL UNIQUE,
  name           TEXT,
  locale         TEXT NOT NULL DEFAULT 'is',
  token          TEXT NOT NULL UNIQUE,
  source         TEXT,               -- 'footer' | 'booking' | 'admin'
  confirmed_at   INTEGER,
  unsubscribed_at INTEGER,
  created_at     INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS subscribers_live
  ON subscribers (confirmed_at) WHERE unsubscribed_at IS NULL;

-- ---------------------------------------------------------------------------
-- Calendar feed tokens.
--
-- A token rather than the admin session, because Google Calendar fetches the
-- feed from Google's servers with no cookie of ours. Revoking is deleting the
-- row, which is why it is a table and not a value in settings.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_tokens (
  token       TEXT PRIMARY KEY,
  label       TEXT,
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  last_used_at INTEGER
);
