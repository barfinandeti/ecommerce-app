# Supabase Backend Setup

## Database Configuration

Your app is configured to use Supabase as the backend.

### Environment Variables (.env.local)

Make sure your `.env.local` contains these Supabase credentials:

```env
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Supabase Database (for Prisma)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

## Initial Data Setup

### 1. Push Schema to Database
```bash
npx prisma db push
npx prisma generate
```

### 2. Make Yourself Superadmin

Run this SQL in Supabase SQL Editor (Settings → Database → SQL Editor):

```sql
-- Replace with your actual phone number
UPDATE "User" 
SET role = 'SUPERADMIN' 
WHERE phone = '+97997270710';
```

### 3. Access Admin Panels

- **Superadmin Panel**: `http://localhost:3000/superadmin`
  - Create organizations
  - Manage users and assign roles
  
- **Admin Panel**: `http://localhost:3000/admin`
  - Manage products
  - View orders
  - See dashboard stats

## Useful Commands

```bash
# Update database schema
npx prisma db push

# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio
```
