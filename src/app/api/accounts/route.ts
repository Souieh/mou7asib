import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const accounts = await prisma.account.findMany({
      orderBy: { code: "asc" },
      include: { children: true },
    })
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const account = await prisma.account.create({
      data: {
        code: body.code,
        name: body.name,
        nameAr: body.nameAr,
        type: body.type,
        normalBalance: body.normalBalance,
        isActive: body.isActive,
        requiresCommitment: body.requiresCommitment,
      },
    })
    return NextResponse.json(account, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
