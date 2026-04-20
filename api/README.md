# mou7asib - Financial Management System

A scalable, enterprise-grade financial management system built with Next.js 16, Prisma, and PostgreSQL. Features comprehensive journal entries, general ledger, account management, invoicing, and financial reporting with a compact, data-rich UI design.

## Features

### Core Modules
- **Chart of Accounts**: Create and manage accounts with multiple account types (Asset, Liability, Equity, Revenue, Expense)
- **Journal Entries**: Record and manage journal entries with approval workflows and balanced entries validation
- **General Ledger**: View detailed ledger entries filtered by account with running balances
- **Contacts Management**: Manage customers and suppliers with contact tracking and balance history
- **Invoice System**: Create and manage invoices with payment tracking and tax calculations
- **Budget Commitments**: Track budget allocations and commitments against actual expenses
- **Fiscal Periods**: Manage accounting periods and period-based reporting
- **Financial Reports**: Comprehensive financial analysis and reporting
- **Audit Log**: Complete audit trail of all system changes with user tracking

### Technical Stack
- **Frontend**: Next.js 16 with React 19.2 and Server Components
- **Database**: PostgreSQL with Prisma ORM and PG Adapter
- **UI Components**: shadcn/ui components with Lucide icons for consistent design
- **Styling**: Tailwind CSS v4 with semantic design tokens
- **State Management**: Zustand for client state, SWR for server state
- **Data Fetching**: SWR with automatic revalidation and caching

## Quick Start

### Prerequisites
- Node.js 18+
- Neon PostgreSQL database
- pnpm package manager

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables in Vercel Settings (Vars section):
   - Add `DATABASE_URL` with your Neon PostgreSQL connection string

3. Run database migrations:
```bash
pnpm db:migrate
```

4. Seed sample data:
```bash
pnpm db:seed
```

5. Start development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (authenticated)/          # Protected authenticated routes
│   │   ├── dashboard/            # Financial dashboard overview
│   │   ├── accounts/             # Chart of accounts management
│   │   ├── journal/              # Journal entry recording
│   │   ├── ledger/               # General ledger viewer
│   │   ├── contacts/             # Contact management
│   │   ├── invoices/             # Invoice management
│   │   ├── commitments/          # Budget commitments
│   │   ├── periods/              # Fiscal period management
│   │   ├── reports/              # Financial reports
│   │   ├── audit-log/            # Audit trail viewer
│   │   ├── settings/             # System settings
│   │   └── layout.tsx            # Authenticated layout with shell
│   ├── api/                      # API route handlers
│   │   ├── accounts/
│   │   ├── journal-entries/
│   │   ├── ledger/
│   │   ├── contacts/
│   │   ├── invoices/
│   │   ├── commitments/
│   │   ├── periods/
│   │   └── audit-log/
│   ├── page.tsx                  # Home page redirect
│   └── layout.tsx                # Root layout
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx         # Main application shell
│   │   ├── sidebar-nav.tsx       # Navigation sidebar with links
│   │   └── header.tsx            # Top header bar
│   ├── modules/                  # Feature-specific components
│   │   ├── accounts/
│   │   │   └── account-form.tsx
│   │   └── journal/
│   │       └── journal-entry-form.tsx
│   └── ui/                       # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── table.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       ├── dialog.tsx
│       ├── empty-state.tsx
│       └── skeleton.tsx
├── lib/
│   ├── prisma.ts                 # Prisma client (lazy-loaded)
│   └── utils.ts                  # Utility functions
└── hooks/
    ├── use-api.ts                # API call wrapper
    ├── use-data-table.ts         # Data table logic
```

## Database Schema

The system includes a comprehensive schema with these key entities:

- **Account**: Chart of accounts with types and normal balances
- **JournalEntry**: Journal entries with approval status
- **JournalLine**: Individual debit/credit lines
- **LedgerEntry**: Summarized ledger entries
- **Contact**: Customer/supplier contacts with balances
- **Invoice**: Invoice documents with line items
- **Payment**: Payment tracking
- **BudgetCommitment**: Budget allocations
- **FiscalPeriod**: Accounting periods
- **TaxCode**: Tax code definitions
- **User**: System users
- **AuditLog**: Audit trail of changes
- **Group & Permission**: Role-based access control

## API Endpoints

All endpoints require the database to be running and return JSON responses.

### Accounts
- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create new account

### Journal Entries
- `GET /api/journal-entries` - List journal entries
- `POST /api/journal-entries` - Create journal entry with lines

### Ledger
- `GET /api/ledger?accountId=X` - Get ledger entries for account

### Contacts
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Create contact

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice

### Commitments
- `GET /api/commitments` - List budget commitments
- `POST /api/commitments` - Create commitment

### Periods
- `GET /api/periods` - List fiscal periods
- `POST /api/periods` - Create period

### Audit Log
- `GET /api/audit-log` - View audit logs

## Design Highlights

### Compact Data-Rich UI
- Multi-column tables for efficient data display
- Sidebar navigation for quick access
- Organized by functional modules
- Responsive design that works on tablets and desktops

### Color Scheme
- Primary Blue: Financial trust and professionalism
- Neutral grays for backgrounds and text
- Green for positive indicators, Red for negative
- Semantic color tokens for consistency

### Performance
- Server-side rendering with Next.js
- Lazy-loaded Prisma client to avoid build-time database connections
- SWR for efficient client-side data fetching and caching
- Optimized database queries via Prisma

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string from Neon

## Common Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build              # Production build
pnpm start              # Run production server

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:migrate         # Run migrations
pnpm db:seed            # Seed sample data
pnpm db:push            # Push schema to database
```

## Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add `DATABASE_URL` environment variable in Settings → Vars
4. Deploy automatically on push

The application will automatically redirect from the home page to the dashboard.

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is set in environment variables
- Check PostgreSQL server is running and accessible
- Ensure connection string format is correct

### Build Errors
- Clear `node_modules` and `.next` directories
- Run `pnpm install` again
- Check Node.js version (18+ required)

### Migration Issues
- Delete `.prisma` directory and run migrations again
- Check for conflicting migration files in `prisma/migrations`

## Support

For issues with:
- **Prisma**: https://www.prisma.io/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
