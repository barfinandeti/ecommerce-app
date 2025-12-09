-- DEBUG AND FIX SCRIPT
-- Run this to check and fix admin user setup

-- Step 1: Check if users exist
SELECT id, email, name, role, "organization_id", password IS NOT NULL as has_password
FROM "users" 
WHERE email IN ('superadmin@test.com', 'admin@test.com');

-- If no results above, users don't exist. Continue to create them.
-- If users exist but login fails, the password hash might be wrong.

-- Step 2: Delete existing test users (if any) to start fresh
DELETE FROM "users" WHERE email IN ('superadmin@test.com', 'admin@test.com');

-- Step 3: Create organization
INSERT INTO "organizations" (id, name, "created_at", "updated_at")
VALUES (
  'test-org-001',
  'Test Organization',
  NOW(),
  NOW()
);

-- Step 4: Create Superadmin
-- Email: superadmin@test.com
-- Password: admin123
INSERT INTO "users" (id, email, password, name, role, "created_at")
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin@test.com',
  '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si',
  'Super Admin',
  'SUPERADMIN',
  NOW()
);

-- Step 5: Create Admin
-- Email: admin@test.com  
-- Password: admin123
INSERT INTO "users" (id, email, password, name, role, "organization_id", "created_at")
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'admin@test.com',
  '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si',
  'Test Admin',
  'ADMIN',
  'test-org-001',
  NOW()
);

-- Step 6: Verify creation
SELECT 
  id, 
  email, 
  name, 
  role, 
  "organization_id",
  password IS NOT NULL as has_password,
  LENGTH(password) as password_length
FROM "users" 
WHERE email IN ('superadmin@test.com', 'admin@test.com');

-- Expected result:
-- Both users should exist with:
-- - has_password = true
-- - password_length = 60 (bcrypt hashes are 60 characters)
