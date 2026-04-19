import { NextRequest, NextResponse } from "next/server"
import getPrismaClient from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = getPrismaClient()
    const entries = await prisma.journalEntry.findMany({
      include: {
        lines: { include: { account: true, contact: true } },
        period: true,
        createdBy: true,
      },
      orderBy: { entryDate: "desc" },
    })
    return NextResponse.json(entries)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = getPrismaClient()
    const body = await req.json()

    const entry = await prisma.journalEntry.create({
      data: {
        periodId: parseInt(body.periodId),
        description: body.description,
        reference: body.reference,
        entryDate: new Date(body.entryDate),
        status: "DRAFT",
        createdById: 1, // TODO: get from auth context
        lines: {
          create: body.lines.map((line: any) => ({
            accountId: line.accountId,
            debitAmount: line.debitAmount,
            creditAmount: line.creditAmount,
            description: line.description,
            contactId: line.contactId,
            commitmentId: line.commitmentId,
          })),
        },
      },
      include: { lines: true },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error("Error creating entry:", error)
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  }
}
