import { NextResponse } from "next/server"
import getPrismaClient from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = getPrismaClient()

    const [accountsCount, entriesCount, contactsCount, invoicesCount] = await Promise.all([
      prisma.account.count(),
      prisma.journalEntry.count(),
      prisma.contact.count(),
      prisma.invoice.count(),
    ])

    return NextResponse.json({
      summary: {
        accounts: accountsCount,
        journalEntries: entriesCount,
        contacts: contactsCount,
        invoices: invoicesCount,
      },
      message: "Welcome to Mou7asib API",
      status: "Operational"
    })
  } catch (error) {
    console.error("Dashboard API Error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
