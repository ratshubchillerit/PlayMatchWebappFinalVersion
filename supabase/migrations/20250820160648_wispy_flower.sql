-- =============================================
-- PLAYMATCH / SUPABASE: FULL DATABASE SCHEMA
-- Idempotent: safe to re-run in Supabase SQL editor
-- =============================================

-- ---------------------------------------------
-- 0) Extensions & utilities
-- ---------------------------------------------
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1) PROFILES (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'player' CHECK (role IN ('player', 'admin', 'turf_owner')),
  sport TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies (drop then create)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (username);

-- =============================================
-- 2) SPORTS
-- =============================================
CREATE TABLE IF NOT EXISTS public.sports (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  max_players INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.sports (name, description, max_players) VALUES
  ('Football', '11v11 football matches', 22),
  ('Cricket', 'Cricket matches with full teams', 22),
  ('Basketball', '5v5 basketball games', 10),
  ('Tennis', 'Singles or doubles tennis', 4),
  ('Badminton', 'Singles or doubles badminton', 4)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 3) TURFS + TURF_SPORTS (many-to-many)
-- =============================================
CREATE TABLE IF NOT EXISTS public.turfs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  hourly_rate DECIMAL(10,2) NOT NULL,
  amenities TEXT[],
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.turf_sports (
  turf_id INTEGER REFERENCES public.turfs(id) ON DELETE CASCADE,
  sport_id INTEGER REFERENCES public.sports(id) ON DELETE CASCADE,
  PRIMARY KEY (turf_id, sport_id)
);

ALTER TABLE public.turfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.turf_sports ENABLE ROW LEVEL SECURITY;

-- Turfs policies
DROP POLICY IF EXISTS "turfs_select_public" ON public.turfs;
CREATE POLICY "turfs_select_public" ON public.turfs
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "turfs_all_owner" ON public.turfs;
CREATE POLICY "turfs_all_owner" ON public.turfs
  FOR ALL USING (auth.uid() = owner_id);

-- Turf_sports policies
DROP POLICY IF EXISTS "turf_sports_select_public" ON public.turf_sports;
CREATE POLICY "turf_sports_select_public" ON public.turf_sports
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "turf_sports_all_owner" ON public.turf_sports;
CREATE POLICY "turf_sports_all_owner" ON public.turf_sports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.turfs t
      WHERE t.id = turf_id AND t.owner_id = auth.uid()
    )
  );

-- Triggers
DROP TRIGGER IF EXISTS trg_turfs_updated_at ON public.turfs;
CREATE TRIGGER trg_turfs_updated_at
BEFORE UPDATE ON public.turfs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_turfs_owner ON public.turfs (owner_id);
CREATE INDEX IF NOT EXISTS idx_turfs_active ON public.turfs (is_active);
CREATE INDEX IF NOT EXISTS idx_turf_sports_sport ON public.turf_sports (sport_id);

-- =============================================
-- 4) TEAMS + TEAM_MEMBERS
-- =============================================
CREATE TABLE IF NOT EXISTS public.teams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sport_id INTEGER REFERENCES public.sports(id),
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  captain_id UUID REFERENCES public.profiles(id),
  max_members INTEGER DEFAULT 11,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Teams policies
DROP POLICY IF EXISTS "teams_select_public" ON public.teams;
CREATE POLICY "teams_select_public" ON public.teams
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "teams_insert_authenticated" ON public.teams;
CREATE POLICY "teams_insert_authenticated" ON public.teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "teams_update_captain" ON public.teams;
CREATE POLICY "teams_update_captain" ON public.teams
  FOR UPDATE USING (auth.uid() = captain_id);

-- Trigger
DROP TRIGGER IF EXISTS trg_teams_updated_at ON public.teams;
CREATE TRIGGER trg_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_teams_sport ON public.teams (sport_id);
CREATE INDEX IF NOT EXISTS idx_teams_captain ON public.teams (captain_id);
CREATE INDEX IF NOT EXISTS idx_teams_active ON public.teams (is_active);

-- Team members
CREATE TABLE IF NOT EXISTS public.team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'member')),
  position TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team_members policies
DROP POLICY IF EXISTS "team_members_select_public" ON public.team_members;
CREATE POLICY "team_members_select_public" ON public.team_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "team_members_insert_self" ON public.team_members;
CREATE POLICY "team_members_insert_self" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "team_members_delete_self" ON public.team_members;
CREATE POLICY "team_members_delete_self" ON public.team_members
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members (user_id);

-- =============================================
-- 5) MATCHES
-- =============================================
CREATE TABLE IF NOT EXISTS public.matches (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sport_id INTEGER REFERENCES public.sports(id),
  turf_id INTEGER REFERENCES public.turfs(id),
  organizer_id UUID REFERENCES public.profiles(id),
  match_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 90,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Matches policies
DROP POLICY IF EXISTS "matches_select_public" ON public.matches;
CREATE POLICY "matches_select_public" ON public.matches
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "matches_insert_authenticated" ON public.matches;
CREATE POLICY "matches_insert_authenticated" ON public.matches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "matches_update_organizer" ON public.matches;
CREATE POLICY "matches_update_organizer" ON public.matches
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Trigger
DROP TRIGGER IF EXISTS trg_matches_updated_at ON public.matches;
CREATE TRIGGER trg_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_sport ON public.matches (sport_id);
CREATE INDEX IF NOT EXISTS idx_matches_turf ON public.matches (turf_id);
CREATE INDEX IF NOT EXISTS idx_matches_organizer ON public.matches (organizer_id);
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches (match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches (status);

-- =============================================
-- 6) BOOKINGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id SERIAL PRIMARY KEY,
  turf_id INTEGER REFERENCES public.turfs(id),
  user_id UUID REFERENCES public.profiles(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT bookings_time_check CHECK (end_time > start_time)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Bookings policies
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
CREATE POLICY "bookings_select_own" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "bookings_update_own" ON public.bookings;
CREATE POLICY "bookings_update_own" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Trigger
DROP TRIGGER IF EXISTS trg_bookings_updated_at ON public.bookings;
CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_turf ON public.bookings (turf_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings (booking_date);

-- =============================================
-- 7) SIGNUP HOOK: auto-create profile when auth.user is created
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 8) ADMIN OVERRIDES
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Admin policies (drop then create)
-- Profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- Turfs
DROP POLICY IF EXISTS "turfs_all_admin" ON public.turfs;
CREATE POLICY "turfs_all_admin" ON public.turfs
  FOR ALL USING (public.is_admin());

-- Turf-sports
DROP POLICY IF EXISTS "turf_sports_all_admin" ON public.turf_sports;
CREATE POLICY "turf_sports_all_admin" ON public.turf_sports
  FOR ALL USING (public.is_admin());

-- Teams
DROP POLICY IF EXISTS "teams_all_admin" ON public.teams;
CREATE POLICY "teams_all_admin" ON public.teams
  FOR ALL USING (public.is_admin());

-- Team members
DROP POLICY IF EXISTS "team_members_all_admin" ON public.team_members;
CREATE POLICY "team_members_all_admin" ON public.team_members
  FOR ALL USING (public.is_admin());

-- Matches
DROP POLICY IF EXISTS "matches_all_admin" ON public.matches;
CREATE POLICY "matches_all_admin" ON public.matches
  FOR ALL USING (public.is_admin());

-- Bookings
DROP POLICY IF EXISTS "bookings_select_admin" ON public.bookings;
CREATE POLICY "bookings_select_admin" ON public.bookings
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "bookings_write_admin" ON public.bookings;
CREATE POLICY "bookings_write_admin" ON public.bookings
  FOR ALL USING (public.is_admin());

-- =============================================
-- 9) BOOKING CONFLICT PREVENTION (no overlaps)
-- =============================================
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS slot tsrange
GENERATED ALWAYS AS (
  tsrange(
    (booking_date::timestamp + start_time),
    (booking_date::timestamp + end_time),
    '[)'
  )
) STORED;

-- Recreate the exclusion constraint cleanly
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_no_overlap_per_turf;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_no_overlap_per_turf
  EXCLUDE USING GIST (
    turf_id WITH =,
    slot   WITH &&
  );

CREATE INDEX IF NOT EXISTS idx_bookings_turf_date ON public.bookings (turf_id, booking_date);

-- =============================================
-- 10) SAMPLE DATA (optional)
-- =============================================
INSERT INTO public.turfs (name, location, description, hourly_rate, amenities, image_url, rating) VALUES
  ('Green Valley Sports Complex', 'Dhaka, Bangladesh', 'Premium football turf with modern facilities', 500.00, ARRAY['Parking','Changing Rooms','Lighting','Refreshments'], 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg', 4.8),
  ('City Sports Center', 'Chittagong, Bangladesh', 'Multi-sport facility in the heart of the city', 400.00, ARRAY['AC','Parking','Lockers','Water'], 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg', 4.6),
  ('Elite Sports Club', 'Sylhet, Bangladesh', 'Luxury sports facility with premium amenities', 800.00, ARRAY['Premium Facilities','Spa','Restaurant','Valet Parking'], 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg', 4.9)
ON CONFLICT DO NOTHING;

-- Map sports to each turf
INSERT INTO public.turf_sports (turf_id, sport_id)
SELECT t.id, s.id
FROM public.turfs t
JOIN public.sports s ON s.name IN ('Football','Cricket')
WHERE t.name = 'Green Valley Sports Complex'
ON CONFLICT DO NOTHING;

INSERT INTO public.turf_sports (turf_id, sport_id)
SELECT t.id, s.id
FROM public.turfs t
JOIN public.sports s ON s.name IN ('Football','Basketball','Badminton','Tennis','Cricket')
WHERE t.name = 'City Sports Center'
ON CONFLICT DO NOTHING;

INSERT INTO public.turf_sports (turf_id, sport_id)
SELECT t.id, s.id
FROM public.turfs t
JOIN public.sports s ON s.name IN ('Tennis','Badminton','Basketball')
WHERE t.name = 'Elite Sports Club'
ON CONFLICT DO NOTHING;

-- =============================================
-- DONE ✅
-- =============================================
