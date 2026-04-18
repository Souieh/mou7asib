"use client"

import { useState, useEffect } from "react"
import { Plus, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export default function CommitmentsPage() {
  const [commitments, setCommitments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommitments()
  }, [])

  async function fetchCommitments() {
    try {
      const res = await fetch("/api/commitments")
      const data = await res.json()
      setCommitments(data)
    } catch (error) {
      console.error("Failed to fetch commitments:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, "default" | "secondary"> = {
    ACTIVE: "default",
    CLOSED: "secondary",
    CANCELLED: "secondary",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget Commitments</h1>
          <p className="text-sm text-muted-foreground">Track budget allocations and spending</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Commitment
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Allocated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(250000)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(145000)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(105000)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Commitments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Consumed</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commitments.map((commitment) => (
                <TableRow key={commitment.id}>
                  <TableCell className="font-medium text-xs">{commitment.commitmentNumber}</TableCell>
                  <TableCell className="text-xs">{commitment.account.code}</TableCell>
                  <TableCell className="text-xs">{commitment.supplier?.name || "-"}</TableCell>
                  <TableCell className="text-xs">{formatCurrency(commitment.amount)}</TableCell>
                  <TableCell className="text-xs">
                    {formatCurrency(commitment.amount - commitment.remaining)}
                  </TableCell>
                  <TableCell className="text-xs">{formatCurrency(commitment.remaining)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[commitment.status]} className="text-xs">
                      {commitment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
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
