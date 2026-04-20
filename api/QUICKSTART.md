# Quick Start Guide - mou7asib

Get your financial management system up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (or any PostgreSQL instance)
- pnpm installed (`npm install -g pnpm`)

## Step 1: Install Dependencies

```bash
pnpm install
```

This installs all required packages including Next.js, Prisma, shadcn/ui components, and Tailwind CSS.

## Step 2: Configure Database Connection

You have two options:

### Option A: Using Vercel (Recommended)

1. Go to your project in Vercel
2. Click "Settings" → "Environment Variables"
3. Click "Add New" and enter:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon PostgreSQL connection string (from neon.tech)
   - Click "Save"

### Option B: Using Local .env.local

Create `.env.local` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Step 3: Setup Database

Run the migration to create all tables:

```bash
pnpm db:migrate
```

This will:
- Create the Prisma database schema
- Run all migrations
- Generate the Prisma client

## Step 4: Seed Sample Data (Optional)

Add sample data to get started:

```bash
pnpm db:seed
```

This creates:
- A default user (admin)
- A fiscal period (FY 2024)
- Sample chart of accounts
- Sample contacts (ABC Corp, XYZ Supplies)
- An opening journal entry with $100,000 starting balance

## Step 5: Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`

The home page will automatically redirect to the dashboard at `http://localhost:3000/dashboard`

## Using the Application

### Main Dashboard
- View financial overview
- Access quick statistics
- Navigate to all modules from the sidebar

### Chart of Accounts
- Create new accounts
- View all accounts organized by type
- Edit account details

### Journal Entries
- Record new transactions
- View debit/credit pairs
- All entries automatically update the general ledger

### General Ledger
- View all transactions for each account
- See running balances
- Filter by date or account

### Contacts
- Manage customers and suppliers
- Track contact information
- View transaction history

### Invoices
- Create and manage invoices
- Track payments
- Calculate taxes

### Additional Features
- Budget Commitments: Track budget allocations
- Fiscal Periods: Manage accounting periods
- Reports: View financial statements
- Audit Log: Track all system changes
- Settings: Configure system options

## Sample Credentials (After Seeding)

- **Username**: admin
- **Email**: admin@mou7asib.local

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Run production build

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed sample data
pnpm db:push          # Push schema to database

# Linting & Formatting
pnpm lint             # Check code style
```

## Troubleshooting

### "DATABASE_URL is not set"
- **Local**: Create `.env.local` with DATABASE_URL
- **Vercel**: Add DATABASE_URL to Settings → Environment Variables
- Restart dev server after adding env var

### "Cannot connect to database"
- Check PostgreSQL server is running
- Verify connection string is correct
- Ensure database exists
- Check network connectivity

### "Migration failed"
- Delete `.prisma/` directory: `rm -rf .prisma`
- Delete `node_modules/`: `rm -rf node_modules`
- Reinstall: `pnpm install`
- Re-run migration: `pnpm db:migrate`

### "Seed script failed"
- Ensure migrations have run first
- Check DATABASE_URL is set correctly
- Try running migrations again first

## File Structure Overview

```
mou7asib/
├── src/
│   ├── app/
│   │   ├── (authenticated)/     # All app pages/routes
│   │   ├── api/                 # API endpoints
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── components/
│   │   ├── layout/              # Shell & navigation
│   │   ├── modules/             # Feature components
│   │   └── ui/                  # Reusable components
│   ├── lib/
│   │   ├── prisma.ts            # Database client
│   │   └── utils.ts             # Helper functions
│   └── hooks/                   # Custom React hooks
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Sample data
│   └── migrations/              # Database versions
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # Full documentation
```

## Deploying to Vercel

1. **Push code to GitHub** - Commit and push your project

2. **Connect to Vercel** - Import the repository:
   - Go to vercel.com
   - Click "Add New" → "Project"
   - Select your repository
   - Click "Import"

3. **Set Environment Variables**:
   - After import, configure settings
   - Add `DATABASE_URL` to Environment Variables
   - Use your Neon PostgreSQL connection string

4. **Deploy** - Click "Deploy"

The app will automatically build and deploy whenever you push to GitHub.

## Next Steps

1. **Create your accounts** - Set up your chart of accounts
2. **Record transactions** - Start entering journal entries
3. **Generate reports** - View financial statements
4. **Customize settings** - Configure your organization details
5. **Invite team members** - Add users (when auth is configured)

## API Endpoints (For Custom Integration)

All API endpoints require the database to be configured:

```
GET  /api/accounts              # List accounts
POST /api/accounts              # Create account

GET  /api/journal-entries       # List entries
POST /api/journal-entries       # Create entry

GET  /api/ledger?accountId=X    # Get ledger entries

GET  /api/contacts              # List contacts
POST /api/contacts              # Create contact

GET  /api/invoices              # List invoices
POST /api/invoices              # Create invoice

GET  /api/commitments           # List commitments
POST /api/commitments           # Create commitment

GET  /api/periods               # List periods
POST /api/periods               # Create period

GET  /api/audit-log             # View audit log
```

## Performance Tips

- The app uses SWR for efficient data fetching
- Server-side rendering speeds up initial load
- Tailwind CSS is optimized with tree-shaking
- Database queries are optimized with Prisma
- Consider adding caching for reports if needed

## Support & Resources

- **Documentation**: See README.md for full docs
- **Prisma**: https://prisma.io/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com
- **shadcn/ui**: https://ui.shadcn.com

## Getting Help

1. Check the README.md for detailed information
2. Review the IMPLEMENTATION.md for architecture details
3. Check browser console for JavaScript errors
4. Look at network tab for API errors
5. Verify DATABASE_URL is set correctly

You're all set! Start building your financial management system.
