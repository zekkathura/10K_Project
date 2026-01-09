-- Migration: User Feedback System
-- Description: Add table for user feedback submissions with rate limiting
-- Created: 2026-01-08

-- ============================================
-- TABLE: user_feedback
-- ============================================
-- Stores user feedback submissions (bug reports, feature requests, house rule suggestions, etc.)

CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bug', 'feature', 'other')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_category ON user_feedback(category);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert feedback (with rate limiting)
-- Rate limit: 5 submissions per day per user
CREATE POLICY "feedback_insert_rate_limited" ON user_feedback FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    -- Check if user has submitted less than 5 times in the last 24 hours
    (
      SELECT COUNT(*) FROM user_feedback
      WHERE user_id = auth.uid()
      AND created_at > now() - interval '24 hours'
    ) < 5
  )
);

-- Policy: Users can only read their own feedback
CREATE POLICY "feedback_select_own" ON user_feedback FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can do anything (for admin access via Supabase dashboard)
CREATE POLICY "feedback_service_role_all" ON user_feedback FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_feedback_updated_at
  BEFORE UPDATE ON user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE user_feedback IS 'User feedback submissions with rate limiting (5 per day)';
COMMENT ON COLUMN user_feedback.user_id IS 'References profiles.id, NULL if user deleted';
COMMENT ON COLUMN user_feedback.email IS 'Cached user email for convenience';
COMMENT ON COLUMN user_feedback.category IS 'Feedback type: bug, feature, other';
COMMENT ON COLUMN user_feedback.message IS 'User feedback message (max 1000 chars enforced in app)';
COMMENT ON COLUMN user_feedback.status IS 'Admin status: new, reviewed, archived';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check table exists and has correct structure
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'user_feedback'
-- ORDER BY ordinal_position;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'user_feedback';

-- Test rate limiting (should fail on 6th insert within 24 hours)
-- INSERT INTO user_feedback (user_id, email, category, message)
-- VALUES (auth.uid(), 'test@example.com', 'bug', 'Test message 1');
-- ... (repeat 4 more times - should succeed)
--
-- INSERT INTO user_feedback (user_id, email, category, message)
-- VALUES (auth.uid(), 'test@example.com', 'bug', 'Test message 6');  -- Should fail

-- View all feedback (service_role only)
-- SELECT id, email, category, left(message, 50) as message_preview, status, created_at
-- FROM user_feedback
-- ORDER BY created_at DESC;
