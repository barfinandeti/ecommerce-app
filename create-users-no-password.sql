-- SIMPLEST SOLUTION: Create users without password
-- We'll set passwords via API call

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

-- Create Superadmin WITHOUT password (we'll set it via API)
INSERT INTO "users" (id, email, name, role, "created_at")
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'superadmin@test.com',
  'Super Admin',
  'SUPERADMIN',
  NOW()
);

-- Create Admin WITHOUT password
INSERT INTO "users" (id, email, name, role, "organization_id", "created_at")
VALUES (
  '20000000-0000-0000-0000-000000000002',
  'admin@test.com',
  'Test Admin',
  'ADMIN',
  'test-org-final',
  NOW()
);

-- Verify
SELECT email, name, role, password IS NULL as needs_password
FROM "users" 
WHERE email IN ('superadmin@test.com', 'admin@test.com');
