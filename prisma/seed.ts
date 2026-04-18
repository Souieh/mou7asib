import prisma from '../src/lib/prisma';

async function main() {
  console.log('Start seeding...');

  // Clear existing data (optional, but good for fresh seeds)
  // Note: Order matters due to foreign key constraints
  try {
    await prisma.auditLog.deleteMany();
    await prisma.ledgerEntry.deleteMany();
    await prisma.journalLine.deleteMany();
    await prisma.journalEntry.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.budgetCommitment.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.account.deleteMany();
    await prisma.fiscalPeriod.deleteMany();
    await prisma.userGroup.deleteMany();
    await prisma.groupPermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();
    await prisma.taxCode.deleteMany();
  } catch (e) {
    console.warn('Cleanup failed (possibly tables do not exist yet). Proceeding with creation...');
  }

  console.log('Cleaned up existing data.');

  // 1. Create a System User
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@mou7asib.local',
      isActive: true,
    },
  });

  // 2. Create a Fiscal Period
  const currentPeriod = await prisma.fiscalPeriod.create({
    data: {
      name: 'FY2024',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'OPEN',
    },
  });

  // 3. Create Chart of Accounts
  const cashAccount = await prisma.account.create({
    data: {
      code: '1010',
      name: 'Main Cash',
      type: 'ASSET',
      normalBalance: 'DEBIT',
    },
  });

  const salesAccount = await prisma.account.create({
    data: {
      code: '4010',
      name: 'Product Sales',
      type: 'REVENUE',
      normalBalance: 'CREDIT',
    },
  });

  // 4. Create a Contact
  const customer = await prisma.contact.create({
    data: {
      name: 'ACME Corp',
      contactType: 'CUSTOMER',
      email: 'finance@acme.corp',
      balance: 0,
    },
  });

  // 5. Create a Journal Entry with Lines
  // This represents a simple cash sale
  await prisma.journalEntry.create({
    data: {
      periodId: currentPeriod.id,
      entryNumber: 'JE-2024-0001',
      entryDate: new Date(),
      description: 'Initial Cash Sale',
      status: 'POSTED',
      createdById: user1.id,
      lines: {
        create: [
          {
            accountId: cashAccount.id,
            debitAmount: 150.0,
            creditAmount: 0,
            contactId: customer.id,
            description: 'Cash received from sale',
          },
          {
            accountId: salesAccount.id,
            debitAmount: 0,
            creditAmount: 150.0,
            description: 'Revenue recognized',
          },
        ],
      },
    },
  });

  // 6. Create a Tax Code
  await prisma.taxCode.create({
    data: {
      code: 'VAT19',
      name: 'Value Added Tax 19%',
      rate: 19.0,
    },
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
