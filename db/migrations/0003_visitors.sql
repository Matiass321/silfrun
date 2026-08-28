-- Real visitor counts, without a cookie and without storing an IP address.
--
-- Apply with:
--   npx wrangler d1 execute silfrun --remote --file=./db/migrations/0003_visitors.sql
--
-- ---------------------------------------------------------------------------
-- The problem this solves.
--
-- Until now every number on the stats page counted page VIEWS, because there
-- was no identifier of any kind and so no way to tell one person loading three
-- pages from three people loading one. That was honest but not very useful:
-- "45 views" does not tell you whether five people looked or forty-five did.
--
-- The fix is a per-day visitor hash:
--
--     visitor = SHA-256(salt_for_today + ip + user-agent + site)
--
-- The IP address is used and immediately thrown away — only the hash is
-- written. The salt is random, generated once a day, and DELETED after two
-- days. Once the salt is gone the hash cannot be recomputed from an IP even
-- with the raw data in hand, so yesterday's visitors cannot be linked to
-- today's and nobody can test "was this person here" after the fact.
--
-- What that buys: unique visitors per day, people on the site right now,
-- bounce rate, views per visitor, and time on site.
--
-- What it costs, and this is a real limit rather than an oversight: because
-- the salt rotates, a person visiting on Monday and again on Thursday is two
-- different visitors. Returning-visitor rates across days are not knowable
-- this way, and the page does not claim them.
--
-- This is the same design Plausible and Fathom use. It is generally treated as
-- not requiring a consent banner because it stores no personal data and no
-- identifier that survives the day. That is a description of the design, not
-- legal advice.
-- ---------------------------------------------------------------------------

ALTER TABLE events ADD COLUMN visitor TEXT;

-- Unique-visitor counts group by (day, visitor); live counts scan recent rows.
CREATE INDEX IF NOT EXISTS events_visitor_day ON events (day, visitor);
CREATE INDEX IF NOT EXISTS events_visitor_time ON events (visitor, created_at);

-- ---------------------------------------------------------------------------
-- The rotating salt.
--
-- One row per day. Old rows are deleted by the writer, which is what makes the
-- hashes unlinkable rather than merely inconvenient to link.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS analytics_salt (
  day        TEXT PRIMARY KEY,       -- 'YYYY-MM-DD', Reykjavík
  salt       TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
