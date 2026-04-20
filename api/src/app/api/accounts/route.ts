import { NextRequest, NextResponse } from "next/server"
import getPrismaClient from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = getPrismaClient()
    const accounts = await prisma.account.findMany({
      orderBy: { code: "asc" },
    })
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = getPrismaClient()
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
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
