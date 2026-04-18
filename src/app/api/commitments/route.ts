import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const commitments = await prisma.budgetCommitment.findMany({
      include: { account: true, supplier: true, journalLines: true },
      orderBy: { date: "desc" },
    })
    return NextResponse.json(commitments)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch commitments" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const commitment = await prisma.budgetCommitment.create({
      data: {
        commitmentNumber: body.commitmentNumber,
        accountId: body.accountId,
        amount: body.amount,
        remaining: body.amount,
        date: new Date(body.date),
        supplierId: body.supplierId,
        description: body.description,
      },
      include: { account: true, supplier: true },
    })
    return NextResponse.json(commitment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create commitment" }, { status: 500 })
  }
}
