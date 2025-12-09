-- Make yourself a Superadmin
-- Replace the phone number with your actual phone number

UPDATE "users"
SET role = 'SUPERADMIN'
WHERE phone = '+97997270710';

-- Verify it worked
SELECT id, phone, role, organization_id FROM "users";
