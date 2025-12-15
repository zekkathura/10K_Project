-- Create profiles for test users in 10k-dev
-- Run this in 10k-dev SQL Editor after creating test users via Authentication UI

-- First, find the user IDs
SELECT id, email FROM auth.users WHERE email LIKE '%@10k.test';

-- Then insert profiles (replace UUIDs with actual values from above query)
-- Uncomment and run after getting the UUIDs:

/*
INSERT INTO profiles (id, email, display_name)
SELECT
  id,
  email,
  CASE
    WHEN email = 'testuser1@10k.test' THEN 'Test User 1'
    WHEN email = 'testuser2@10k.test' THEN 'Test User 2'
    ELSE 'Test User'
  END
FROM auth.users
WHERE email LIKE '%@10k.test'
ON CONFLICT (id) DO NOTHING;
*/

-- Verify profiles were created:
-- SELECT * FROM profiles WHERE email LIKE '%@10k.test';
