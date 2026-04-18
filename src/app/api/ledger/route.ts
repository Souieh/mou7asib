import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const accountId = req.nextUrl.searchParams.get("accountId")

    if (!accountId) {
      return NextResponse.json({ error: "accountId is required" }, { status: 400 })
    }

    const ledgerEntries = await prisma.ledgerEntry.findMany({
      where: { accountId: parseInt(accountId) },
      include: { journalLine: true },
      orderBy: { entryDate: "asc" },
    })

    return NextResponse.json(ledgerEntries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ledger" }, { status: 500 })
  }
}
