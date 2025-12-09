# 🎯 ADMIN SYSTEM - FINAL SETUP & TEST

##  Complete Working Setup

### 1. Create Admin Users in Database

Run this SQL in Supabase SQL Editor:
```sql
DELETE FROM "users" WHERE email IN ('superadmin@test.com', 'admin@test.com');
DELETE FROM "organizations" WHERE id = 'test-org-final';

-- Create organization
INSERT INTO "organizations" (id, name, "created_at", "updated_at")
VALUES ('test-org-final', 'Test Organization', NOW(), NOW());

-- Create users without passwords
INSERT INTO "users" (id, email, name, role, "created_at")
VALUES (gen_random_uuid(), 'superadmin@test.com', 'Super Admin', 'SUPERADMIN', NOW());

INSERT INTO "users" (id, email, name, role, "organization_id", "created_at")
VALUES (gen_random_uuid(), 'admin@test.com', 'Test Admin', 'ADMIN', 'test-org-final', NOW());
```

### 2. Set Passwords via API

Run in PowerShell:
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/auth/setup-password" -Method POST -ContentType "application/json" -Body '{"email":"superadmin@test.com","password":"admin123"}'

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/auth/setup-password" -Method POST -ContentType "application/json" -Body '{"email":"admin@test.com","password":"admin123"}'
```

### 3. Login & Test

**Login:**
- URL: `http://localhost:3000/admin-login`
- Email: `superadmin@test.com`
- Password: `admin123`

**Expected Result:**
✅ Redirected to `/superadmin`  
✅ Dashboard shows real-time stats  
✅ Sidebar has: Dashboard, Organizations, Users, Products, Categories  
✅ Can navigate to all pages  
✅ APIs return data (not 401)  

## ✨ Features Available

### Superadmin Sidebar:
1. **Dashboard** - Real-time global stats
2. **Organizations** - List/Create/Edit/Delete
3. **Users** - Global user management
4. **Products** - All products across all orgs
5. **Categories** - All categories across all orgs

### Admin Sidebar:
1. **Dashboard** - Organization-scoped stats
2. **Products** - Org products (with videos, postal codes, categories)
3. **Categories** - Org categories
4. **Orders** - Org orders

## 🔒 Security Features:
- ✅ Route protection (can't access without login)
- ✅ Token-based authentication (24hr expiry)
- ✅ Role-based access control
- ✅ Organization scoping for admins
- ✅ Password hashing (bcrypt)

## 🐛 Troubleshooting

**Still getting 401?**
1. Logout and login again to get fresh token
2. Check browser console for token
3. Check terminal for API logs

**Dashboard empty?**
1. Stats API might need organization/products in DB
2. Check terminal logs for errors

**Can't login?**
1. Run password setup commands again
2. Check SQL was successful
3. Verify user exists: `SELECT * FROM users WHERE email = 'superadmin@test.com'`

## 🎉 Success Criteria

You should be able to:
- [x] Login as Superadmin
- [x] See 5 links in sidebar
- [x] Dashboard loads with stats  
- [x] Organizations page loads
- [x] Users page loads
- [x] Products page loads (may be empty)
- [x] Categories page loads (may be empty)
- [x] No 401 errors in terminal

Try it now! 🚀
