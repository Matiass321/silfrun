-- Media library.
--
-- Apply with:
--   npx wrangler d1 execute silfrun --remote --file=./db/migrations/0002_media.sql
--
-- The file itself is in KV under `key`; this table is everything that has to
-- be queried, ordered or translated. Keeping the binary out of D1 matters:
-- a row read on every page render must not drag a photograph through it.

CREATE TABLE IF NOT EXISTS media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,

  -- KV key. Content-addressed, so re-uploading the same file is idempotent.
  key         TEXT NOT NULL UNIQUE,

  kind        TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image', 'video')),
  mime        TEXT NOT NULL,
  bytes       INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,

  -- Where it appears. NULL means it is in the library but not placed, which is
  -- a normal state — uploading and placing are separate decisions.
  slot        TEXT,

  -- Order within a slot, for galleries. Lower first.
  position    INTEGER NOT NULL DEFAULT 0,

  -- Alt text per language. A photograph with no alt text is not publishable,
  -- so the admin refuses to place one until at least the Icelandic is written.
  alt_is      TEXT,
  alt_en      TEXT,

  -- Free caption, shown under gallery items. Optional.
  caption_is  TEXT,
  caption_en  TEXT,

  -- For a before/after pair: the id of the matching image and which side this
  -- one is. The pair is the whole point of the gallery, and a pair that has
  -- lost its other half must be detectable.
  pair_id     INTEGER REFERENCES media(id),
  pair_role   TEXT CHECK (pair_role IN ('before', 'after')),

  -- Poster frame for a video, as a media id.
  poster_id   INTEGER REFERENCES media(id),

  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS media_slot ON media (slot, position) WHERE slot IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_pair ON media (pair_id) WHERE pair_id IS NOT NULL;
