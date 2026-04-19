import { NextRequest, NextResponse } from "next/server"
import getPrismaClient from "@/lib/prisma"

export async function GET() {
  try {
    const prisma = getPrismaClient()
    const invoices = await prisma.invoice.findMany({
      include: { contact: true },
      orderBy: { invoiceDate: "desc" },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const prisma = getPrismaClient()
    const body = await req.json()
    const invoice = await prisma.invoice.create({
      data: {
        contactId: body.contactId,
        invoiceNumber: body.invoiceNumber,
        invoiceDate: new Date(body.invoiceDate),
        dueDate: new Date(body.dueDate),
        totalAmount: body.totalAmount,
      },
      include: { contact: true },
    })
    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}
