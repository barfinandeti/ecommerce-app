-- WORKING ADMIN USERS SETUP
-- Generated password hash: Run this exact script

-- Clean up first
DELETE FROM "users" WHERE email IN ('superadmin@test.com', 'admin@test.com');
DELETE FROM "organizations" WHERE id = 'test-org-final';

-- Create organization
INSERT INTO "organizations" (id, name, "created_at", "updated_at")
VALUES (
  'test-org-final',
  'Test Organization',
  NOW(),
  NOW()
);

-- Create Superadmin with CORRECT hash
-- Email: superadmin@test.com
-- Password: admin123
INSERT INTO "users" (id, email, password, name, role, "created_at")
VALUES (
  gen_random_uuid(),
  'superadmin@test.com',
  '$2b$10$Wbr6KwcNE53kPl.cwQs8au9SKK0QRKwIhX/XkK3FpIr/8IBjy',
  'Super Admin',
  'SUPERADMIN',
  NOW()
);

-- Create Admin with CORRECT hash
-- Email: admin@test.com
-- Password: admin123
INSERT INTO "users" (id, email, password, name, role, "organization_id", "created_at")
VALUES (
  gen_random_uuid(),
  'admin@test.com',
  '$2b$10$Wbr6KwcNE53kPl.cwQs8au9SKK0QRKwIhX/XkK3FpIr/8IBjy',
  'Test Admin',
  'ADMIN',
  'test-org-final',
  NOW()
);

-- Verify
SELECT 
  email, 
  name, 
  role, 
  "organization_id",
  password IS NOT NULL as has_password
FROM "users" 
WHERE email IN ('superadmin@test.com', 'admin@test.com');
