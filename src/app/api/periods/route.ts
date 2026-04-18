import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const periods = await prisma.fiscalPeriod.findMany({
      orderBy: { startDate: "desc" },
    })
    return NextResponse.json(periods)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch periods" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const period = await prisma.fiscalPeriod.create({
      data: {
        name: body.name,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: "OPEN",
      },
    })
    return NextResponse.json(period, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create period" }, { status: 500 })
  }
}
