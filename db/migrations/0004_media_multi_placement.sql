-- One photograph, more than one place.
--
-- Apply with:
--   npx wrangler d1 execute silfrun --remote --file=./db/migrations/0004_media_multi_placement.sql
--
-- ---------------------------------------------------------------------------
-- `key` was UNIQUE. The intent was that re-uploading the same file should be
-- idempotent, which is right — but the constraint enforced something stronger
-- and unintended: a file could only ever be placed ONCE. Putting the same shot
-- in two slots means a second row pointing at the same content-addressed
-- object, and the insert was rejected. Silently: the admin reported success
-- and nothing appeared.
--
-- Idempotent upload does not need the constraint. The upload path already
-- looks the key up before writing and reuses the existing object, and the
-- delete path already refuses to drop the KV object while any other row still
-- references the key. Both were written that way before this.
--
-- SQLite cannot drop a constraint, so the table is rebuilt. A non-unique index
-- replaces it, because every one of those lookups still wants to be fast.
-- ---------------------------------------------------------------------------

PRAGMA foreign_keys = OFF;

CREATE TABLE media_new (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,

  -- KV key, content-addressed. No longer unique: one object, many placements.
  key         TEXT NOT NULL,

  kind        TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image', 'video')),
  mime        TEXT NOT NULL,
  bytes       INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,

  slot        TEXT,
  position    INTEGER NOT NULL DEFAULT 0,

  alt_is      TEXT,
  alt_en      TEXT,
  caption_is  TEXT,
  caption_en  TEXT,

  pair_id     INTEGER REFERENCES media_new(id),
  pair_role   TEXT CHECK (pair_role IN ('before', 'after')),
  poster_id   INTEGER REFERENCES media_new(id),

  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO media_new
  (id, key, kind, mime, bytes, width, height, slot, position,
   alt_is, alt_en, caption_is, caption_en, pair_id, pair_role, poster_id,
   created_at, updated_at)
SELECT
   id, key, kind, mime, bytes, width, height, slot, position,
   alt_is, alt_en, caption_is, caption_en, pair_id, pair_role, poster_id,
   created_at, updated_at
FROM media;

DROP TABLE media;
ALTER TABLE media_new RENAME TO media;

CREATE INDEX IF NOT EXISTS media_slot ON media (slot, position) WHERE slot IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_pair ON media (pair_id) WHERE pair_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_key  ON media (key);

PRAGMA foreign_keys = ON;
