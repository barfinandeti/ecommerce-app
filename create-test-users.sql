-- COMPLETE ADMIN SETUP SCRIPT
-- Run this in Supabase SQL Editor to set up test admin users

-- Step 1: Create an organization
INSERT INTO "organizations" (id, name, "created_at", "updated_at")
VALUES (
  'org-123-test',
  'Test Store',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create users in the database with hashed passwords
-- Password for both: admin123
-- Hash: $2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si

-- Create Superadmin
INSERT INTO "users" (id, email, password, name, role, "created_at")
VALUES (
  gen_random_uuid(),
  'superadmin@test.com',
  '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si',
  'Super Admin',
  'SUPERADMIN',
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET password = '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si';

-- Create Admin
INSERT INTO "users" (id, email, password, name, role, "organization_id", "created_at")
VALUES (
  gen_random_uuid(),
  'admin@test.com',
  '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si',
  'Admin User',
  'ADMIN',
  'org-123-test',
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET 
  password = '$2a$10$YV4sE9OmXN9vJ8hC4PxZCOfV7t0oKQJ66X1vQ8WHvmXy0CRHvI9Si',
  "organization_id" = 'org-123-test';

-- Step 3: Verify users were created
SELECT id, email, name, role, "organization_id" 
FROM "users" 
WHERE email IN ('superadmin@test.com', 'admin@test.com');

-- IMPORTANT NOTES:
-- 1. Login credentials:
--    - Superadmin: superadmin@test.com / admin123
--    - Admin: admin@test.com / admin123
--
-- 2. On first login, a Supabase Auth account will be automatically created
--
-- 3. After this, go to http://localhost:3000/admin-login to test
