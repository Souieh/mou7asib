import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        nameAr: body.nameAr,
        contactType: body.contactType,
        email: body.email,
        phone: body.phone,
        address: body.address,
        taxId: body.taxId,
      },
    })
    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
