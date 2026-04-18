"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  async function fetchInvoices() {
    try {
      const res = await fetch("/api/invoices")
      const data = await res.json()
      setInvoices(data)
    } catch (error) {
      console.error("Failed to fetch invoices:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    DRAFT: "secondary",
    POSTED: "default",
    PARTIALLY_PAID: "outline",
    PAID: "default",
    VOID: "secondary",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">Sales and purchase invoices</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium text-xs">{invoice.invoiceNumber}</TableCell>
                  <TableCell className="text-xs">{invoice.contact.name}</TableCell>
                  <TableCell className="text-xs">{formatDate(invoice.invoiceDate)}</TableCell>
                  <TableCell className="text-xs">{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(invoice.paidAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[invoice.status]} className="text-xs">
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
