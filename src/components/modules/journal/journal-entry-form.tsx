"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

interface JournalEntryFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface JournalLine {
  id?: string
  accountId: string
  accountCode?: string
  accountName?: string
  debitAmount: string
  creditAmount: string
  contactId?: string
  commitmentId?: string
  description?: string
}

export function JournalEntryForm({ onSuccess, onCancel }: JournalEntryFormProps) {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", debitAmount: "", creditAmount: "", description: "" },
  ])
  const [formData, setFormData] = useState({
    description: "",
    reference: "",
    entryDate: new Date().toISOString().split("T")[0],
    periodId: "1",
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/accounts")
      setAccounts(res.ok ? await res.json() : [])
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    }
  }

  const totalDebits = lines.reduce((sum, line) => sum + parseFloat(line.debitAmount || 0), 0)
  const totalCredits = lines.reduce((sum, line) => sum + parseFloat(line.creditAmount || 0), 0)
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isBalanced) {
      alert("Entry must be balanced")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/journal-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lines: lines.map((line) => ({
            accountId: parseInt(line.accountId),
            debitAmount: parseFloat(line.debitAmount || 0),
            creditAmount: parseFloat(line.creditAmount || 0),
            description: line.description,
            contactId: line.contactId ? parseInt(line.contactId) : null,
            commitmentId: line.commitmentId ? parseInt(line.commitmentId) : null,
          })),
        }),
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving entry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium">Date</label>
          <Input
            type="date"
            value={formData.entryDate}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium">Description</label>
          <Input
            placeholder="Entry description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium">Reference</label>
          <Input
            placeholder="Invoice/Receipt #"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Journal Lines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {lines.map((line, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-end">
              <select
                value={line.accountId}
                onChange={(e) => {
                  const account = accounts.find((a) => a.id === parseInt(e.target.value))
                  const newLines = [...lines]
                  newLines[idx].accountId = e.target.value
                  newLines[idx].accountCode = account?.code
                  newLines[idx].accountName = account?.name
                  setLines(newLines)
                }}
                className="col-span-3 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="">Select Account</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.code} - {acc.name}
                  </option>
                ))}
              </select>

              <Input
                type="number"
                placeholder="Debit"
                value={line.debitAmount}
                onChange={(e) => {
                  const newLines = [...lines]
                  newLines[idx].debitAmount = e.target.value
                  newLines[idx].creditAmount = ""
                  setLines(newLines)
                }}
                className="col-span-2 text-xs"
                step="0.01"
              />

              <Input
                type="number"
                placeholder="Credit"
                value={line.creditAmount}
                onChange={(e) => {
                  const newLines = [...lines]
                  newLines[idx].creditAmount = e.target.value
                  newLines[idx].debitAmount = ""
                  setLines(newLines)
                }}
                className="col-span-2 text-xs"
                step="0.01"
              />

              <Input
                placeholder="Description"
                value={line.description}
                onChange={(e) => {
                  const newLines = [...lines]
                  newLines[idx].description = e.target.value
                  setLines(newLines)
                }}
                className="col-span-3 text-xs"
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                className="col-span-1"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLines([...lines, { accountId: "", debitAmount: "", creditAmount: "", description: "" }])}
            className="w-full gap-2 mt-2"
          >
            <Plus className="h-4 w-4" />
            Add Line
          </Button>

          <div className="grid grid-cols-12 gap-2 pt-2 border-t">
            <div className="col-span-3" />
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold">{formatCurrency(totalDebits)}</p>
            </div>
            <div className="col-span-2 text-right">
              <p className="text-xs font-semibold">{formatCurrency(totalCredits)}</p>
            </div>
            <div className="col-span-4 text-right">
              {isBalanced ? (
                <Badge className="text-xs">Balanced ✓</Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Difference: {formatCurrency(Math.abs(totalDebits - totalCredits))}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !isBalanced}>
          {loading ? "Saving..." : "Save Entry"}
        </Button>
      </div>
    </form>
  )
}
