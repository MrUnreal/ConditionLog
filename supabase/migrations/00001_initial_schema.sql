-- ConditionLog: Initial Schema Migration
-- Creates all core tables, RLS policies, triggers, and storage buckets.

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE property_type AS ENUM (
  'apartment', 'house', 'condo', 'studio', 'townhouse', 'other'
);

CREATE TYPE report_type AS ENUM ('move_in', 'move_out', 'maintenance');
CREATE TYPE report_status AS ENUM ('draft', 'completed', 'exported');
CREATE TYPE ai_severity AS ENUM ('none', 'minor', 'moderate', 'severe');
CREATE TYPE subscription_tier AS ENUM ('free', 'per_report', 'pro');

-- =============================================================================
-- HELPER: updated_at trigger function
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- PROFILES (references auth.users)
-- =============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- PROPERTIES
-- =============================================================================

CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_type property_type NOT NULL DEFAULT 'apartment',
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  unit_number TEXT,
  landlord_name TEXT,
  landlord_email TEXT,
  lease_start DATE,
  lease_end DATE,
  deposit_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_deleted_at ON properties(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own properties"
  ON properties FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft-delete own properties"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- REPORTS
-- =============================================================================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  status report_status NOT NULL DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  pdf_url TEXT,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_property_id ON reports(property_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_share_token ON reports(share_token) WHERE share_token IS NOT NULL;
CREATE INDEX idx_reports_deleted_at ON reports(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports"
  ON reports FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL)
  WITH CHECK (auth.uid() = user_id);

-- Public access via share token (no auth required)
CREATE POLICY "Anyone can view shared reports"
  ON reports FOR SELECT
  USING (share_token IS NOT NULL AND deleted_at IS NULL);

-- =============================================================================
-- ROOMS
-- =============================================================================

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  room_type TEXT NOT NULL,
  room_label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_report_id ON rooms(report_id);

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for rooms
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rooms of own reports"
  ON rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = rooms.report_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can manage rooms of own reports"
  ON rooms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = rooms.report_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can update rooms of own reports"
  ON rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = rooms.report_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can delete rooms of own reports"
  ON rooms FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = rooms.report_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

-- Public access for shared reports
CREATE POLICY "Anyone can view rooms of shared reports"
  ON rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reports
      WHERE reports.id = rooms.report_id
        AND reports.share_token IS NOT NULL
        AND reports.deleted_at IS NULL
    )
  );

-- =============================================================================
-- PHOTOS
-- =============================================================================

CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  caption TEXT,
  notes TEXT,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  ai_damage_detected BOOLEAN NOT NULL DEFAULT FALSE,
  ai_damage_labels JSONB,
  ai_description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_room_id ON photos(room_id);

CREATE TRIGGER photos_updated_at
  BEFORE UPDATE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view photos of own reports"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN reports ON reports.id = rooms.report_id
      WHERE rooms.id = photos.room_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can manage photos of own reports"
  ON photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN reports ON reports.id = rooms.report_id
      WHERE rooms.id = photos.room_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can update photos of own reports"
  ON photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN reports ON reports.id = rooms.report_id
      WHERE rooms.id = photos.room_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

CREATE POLICY "Users can delete photos of own reports"
  ON photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN reports ON reports.id = rooms.report_id
      WHERE rooms.id = photos.room_id
        AND reports.user_id = auth.uid()
        AND reports.deleted_at IS NULL
    )
  );

-- Public access for shared reports
CREATE POLICY "Anyone can view photos of shared reports"
  ON photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rooms
      JOIN reports ON reports.id = rooms.report_id
      WHERE rooms.id = photos.room_id
        AND reports.share_token IS NOT NULL
        AND reports.deleted_at IS NULL
    )
  );

-- =============================================================================
-- COMPARISONS (for Phase 3 — move-in vs move-out)
-- =============================================================================

CREATE TABLE comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  move_in_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  move_out_photo_id UUID REFERENCES photos(id) ON DELETE SET NULL,
  ai_diff_description TEXT,
  ai_severity ai_severity,
  ai_diff_overlay_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER comparisons_updated_at
  BEFORE UPDATE ON comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('photos', 'photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('thumbnails', 'thumbnails', false, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('reports', 'reports', false, 52428800, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for photos bucket
CREATE POLICY "Users can upload own photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'photos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS for thumbnails
CREATE POLICY "Users can upload own thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'thumbnails'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own thumbnails"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'thumbnails'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS for reports (PDFs)
CREATE POLICY "Users can upload own reports"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reports'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own reports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Public access to photos/thumbnails/reports for shared reports
-- These use a service role key in the API to serve public shared report assets
-- so we don't need anonymous storage policies here.
