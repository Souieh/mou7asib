"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, Archive, RotateCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { JournalEntryForm } from "@/components/modules/journal/journal-entry-form"

export default function JournalEntriesPage() {
  const [showForm, setShowForm] = useState(false)
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    try {
      const res = await fetch("/api/journal-entries")
      const data = await res.json()
      setEntries(data)
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    DRAFT: "secondary",
    PENDING_APPROVAL: "outline",
    POSTED: "default",
    VOID: "secondary",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal Entries</h1>
          <p className="text-sm text-muted-foreground">Record and manage all journal entries</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Journal Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <JournalEntryForm
              onSuccess={() => {
                setShowForm(false)
                fetchEntries()
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Entries</CardTitle>
          <CardDescription>Showing all journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const total = entry.lines.reduce(
                    (sum: number, line: any) => sum + parseFloat(line.debitAmount || 0),
                    0
                  )
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="text-xs">{formatDate(entry.entryDate)}</TableCell>
                      <TableCell className="text-xs">{entry.description}</TableCell>
                      <TableCell className="text-xs font-medium">{formatCurrency(total)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[entry.status]} className="text-xs">
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {entry.status === "DRAFT" && (
                          <Button variant="ghost" size="sm">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
