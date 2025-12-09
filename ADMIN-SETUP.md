# Admin & Superadmin Dashboard Setup

## ✅ Database Setup Complete
Your Prisma schema is synced with Supabase!

## Step 1: Make Yourself a Superadmin

Run this SQL in **Supabase SQL Editor**:

1. Go to https://supabase.com/dashboard
2. Select your project → **SQL Editor**
3. Paste and run:

```sql
UPDATE "users"
SET role = 'SUPERADMIN'
WHERE phone = '+97997270710';

-- Verify it worked
SELECT id, phone, role, organization_id FROM "users";
```

## Step 2: Access Your Dashboards

### Superadmin Panel
Visit: `http://localhost:3000/superadmin`

Features:
- **Dashboard**: View global stats (organizations, users)
- **Organizations**: Create and manage organizations
- **Users**: Assign roles (Admin, User) and link users to organizations

### Admin Panel  
Visit: `http://localhost:3000/admin`

Features:
- **Dashboard**: View organization stats (products, orders, revenue)
- **Products**: Add, edit, and delete products
- **Orders**: View and manage orders

## Step 3: Create Your First Organization

1. Go to `http://localhost:3000/superadmin/organizations`
2. Enter an organization name (e.g., "My Store")
3. Click "Create"

## Step 4: Assign Yourself as Admin

1. Go to `http://localhost:3000/superadmin/users`
2. Find your user in the table
3. Change role to "Admin"
4. Select your organization from the dropdown
5. Now you can access `/admin` panel!

## Workflow

**As Superadmin:**
- Create organizations for different stores/businesses
- Create admin users and assign them to organizations
- View global system statistics

**As Admin:**
- Manage products for your organization
- View orders from customers
- See revenue and analytics

All data is automatically scoped to your organization!
