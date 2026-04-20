import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  try {
    // Clean up in order of dependencies
    await prisma.auditLog.deleteMany()
    await prisma.ledgerEntry.deleteMany()
    await prisma.journalLine.deleteMany()
    await prisma.journalEntry.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.budgetCommitment.deleteMany()
    await prisma.contact.deleteMany()
    await prisma.account.deleteMany()
    await prisma.fiscalPeriod.deleteMany()
    await prisma.userGroup.deleteMany()
    await prisma.groupPermission.deleteMany()
    await prisma.permission.deleteMany()
    await prisma.group.deleteMany()
    await prisma.user.deleteMany()
    await prisma.taxCode.deleteMany()
    console.log("Cleaned up existing data")
  } catch (e) {
    console.warn("Cleanup skipped - first run")
  }

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@mou7asib.local",
      isActive: true,
    },
  })

  // Create fiscal period
  const period = await prisma.fiscalPeriod.create({
    data: {
      name: "FY 2024",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
      status: "OPEN",
    },
  })

  // Create Chart of Accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: { code: "1010", name: "Cash", type: "ASSET", normalBalance: "DEBIT" },
    }),
    prisma.account.create({
      data: { code: "1100", name: "Accounts Receivable", type: "ASSET", normalBalance: "DEBIT" },
    }),
    prisma.account.create({
      data: { code: "2000", name: "Accounts Payable", type: "LIABILITY", normalBalance: "CREDIT" },
    }),
    prisma.account.create({
      data: { code: "3000", name: "Common Stock", type: "EQUITY", normalBalance: "CREDIT" },
    }),
    prisma.account.create({
      data: { code: "4010", name: "Sales Revenue", type: "REVENUE", normalBalance: "CREDIT" },
    }),
    prisma.account.create({
      data: { code: "5010", name: "Salaries Expense", type: "EXPENSE", normalBalance: "DEBIT" },
    }),
  ])

  // Create contacts
  const customer = await prisma.contact.create({
    data: {
      name: "ABC Corp",
      contactType: "CUSTOMER",
      email: "contact@abc.com",
      phone: "+1-555-0001",
    },
  })

  const supplier = await prisma.contact.create({
    data: {
      name: "XYZ Supplies",
      contactType: "SUPPLIER",
      email: "sales@xyz.com",
      phone: "+1-555-0002",
    },
  })

  // Create sample journal entry
  await prisma.journalEntry.create({
    data: {
      periodId: period.id,
      entryNumber: "JE-2024-0001",
      entryDate: new Date(),
      description: "Opening Balance",
      status: "POSTED",
      createdById: admin.id,
      lines: {
        create: [
          {
            accountId: accounts[0].id,
            debitAmount: 100000,
            creditAmount: 0,
            description: "Initial cash",
          },
          {
            accountId: accounts[3].id,
            debitAmount: 0,
            creditAmount: 100000,
            description: "Owner contribution",
          },
        ],
      },
    },
  })

  // Create tax code
  await prisma.taxCode.create({
    data: {
      code: "VAT",
      name: "Value Added Tax",
      rate: 19.0,
    },
  })

  console.log("✓ Database seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
