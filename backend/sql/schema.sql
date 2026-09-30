-- WellnessCircle database schema

CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user'
                CHECK (role IN ('admin', 'user')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL
                  REFERENCES users(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  username        TEXT UNIQUE NOT NULL
                  CHECK (
                    char_length(username) >= 3
                    AND username ~ '^[a-zA-Z0-9]+$'
                  ),
  profile_pic_url TEXT,
  location        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id       UUID NOT NULL
                   REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  event_date       TIMESTAMPTZ NOT NULL,
  location_text    TEXT NOT NULL,
  category         TEXT NOT NULL
                   CHECK (
                     category IN (
                       'Yoga',
                       'Running',
                       'Meditation',
                       'Marathon',
                       'Other'
                     )
                   ),
  cover_image_url  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_attendees (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL
             REFERENCES events(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL
             REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_events_date
ON events(event_date);

CREATE INDEX IF NOT EXISTS idx_events_creator
ON events(creator_id);

CREATE INDEX IF NOT EXISTS idx_attendees_event
ON event_attendees(event_id);

CREATE INDEX IF NOT EXISTS idx_attendees_user
ON event_attendees(user_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON users;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_events_updated ON events;

CREATE TRIGGER trg_events_updated
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();