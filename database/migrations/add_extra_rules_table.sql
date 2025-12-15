-- Migration: Add extra_rules table for house rules
-- Run this in Supabase SQL Editor

-- Create the extra_rules table
CREATE TABLE IF NOT EXISTS extra_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_number INTEGER NOT NULL,
  text TEXT NOT NULL,
  proposer TEXT,
  approved_by TEXT,
  revoked_by TEXT,
  rule_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on rule_number for ordering
CREATE INDEX IF NOT EXISTS idx_extra_rules_rule_number ON extra_rules(rule_number);

-- Enable RLS
ALTER TABLE extra_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can read
CREATE POLICY "extra_rules_select_authenticated"
  ON extra_rules
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: Only service_role can insert/update/delete (admin only)
-- No policy needed - service_role bypasses RLS by default
-- Regular users won't be able to modify without explicit policy

-- Grant read access to authenticated users
GRANT SELECT ON extra_rules TO authenticated;

-- Verify table was created
SELECT 'extra_rules table created successfully' AS status;
