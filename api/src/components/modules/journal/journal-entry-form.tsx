"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

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
  const t = useTranslations()
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [commitments, setCommitments] = useState<any[]>([])
  const [periods, setPeriods] = useState<any[]>([])
  const [lines, setLines] = useState<JournalLine[]>([
    { accountId: "", debitAmount: "", creditAmount: "", description: "" },
    { accountId: "", debitAmount: "", creditAmount: "", description: "" },
  ])
  const [formData, setFormData] = useState({
    description: "",
    reference: "",
    entryDate: new Date().toISOString().split("T")[0],
    periodId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [accRes, contactRes, commitRes, periodRes] = await Promise.all([
        fetch("/api/accounts"),
        fetch("/api/contacts"),
        fetch("/api/commitments"),
        fetch("/api/periods"),
      ])

      const [accData, contactData, commitData, periodData] = await Promise.all([
        accRes.ok ? accRes.json() : [],
        contactRes.ok ? contactRes.json() : [],
        commitRes.ok ? commitRes.json() : [],
        periodRes.ok ? periodRes.json() : [],
      ])

      setAccounts(accData)
      setContacts(contactData)
      setCommitments(commitData)
      setPeriods(periodData)

      if (periodData.length > 0) {
        setFormData((prev) => ({ ...prev, periodId: periodData[0].id.toString() }))
      }
    } catch (error) {
      console.error("Failed to fetch form data:", error)
    }
  }

  const totalDebits = lines.reduce((sum, line) => sum + parseFloat(line.debitAmount as string || "0"), 0)
  const totalCredits = lines.reduce((sum, line) => sum + parseFloat(line.creditAmount as string || "0"), 0)
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isBalanced) {
      alert(t("journal.unbalanced"))
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
            debitAmount: parseFloat((line.debitAmount as string) || "0"),
            creditAmount: parseFloat((line.creditAmount as string) || "0"),
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
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium">{t("journal.date")}</label>
          <Input
            type="date"
            value={formData.entryDate}
            onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium">{t("journal.description")}</label>
          <Input
            placeholder={t("journal.description")}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium">{t("journal.reference")}</label>
          <Input
            placeholder={t("journal.reference")}
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-medium">Period</label>
          <select
            value={formData.periodId}
            onChange={(e) => setFormData({ ...formData, periodId: e.target.value })}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">{t("common.selectPeriod")}</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t("journal.lines")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lines.map((line, idx) => (
            <div key={idx} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-3">
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                    {t("journal.account")}
                  </label>
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
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="">{t("common.selectAccount")}</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                    {t("journal.debit")}
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={line.debitAmount}
                    onChange={(e) => {
                      const newLines = [...lines]
                      newLines[idx].debitAmount = e.target.value
                      if (e.target.value) newLines[idx].creditAmount = ""
                      setLines(newLines)
                    }}
                    className="h-9 text-xs"
                    step="0.01"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                    {t("journal.credit")}
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={line.creditAmount}
                    onChange={(e) => {
                      const newLines = [...lines]
                      newLines[idx].creditAmount = e.target.value
                      if (e.target.value) newLines[idx].debitAmount = ""
                      setLines(newLines)
                    }}
                    className="h-9 text-xs"
                    step="0.01"
                  />
                </div>

                <div className="col-span-4">
                  <label className="text-[10px] uppercase text-muted-foreground font-bold">
                    {t("journal.description")}
                  </label>
                  <Input
                    placeholder={t("journal.description")}
                    value={line.description}
                    onChange={(e) => {
                      const newLines = [...lines]
                      newLines[idx].description = e.target.value
                      setLines(newLines)
                    }}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                    disabled={lines.length <= 2}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold whitespace-nowrap">
                    {t("journal.contact")}:
                  </span>
                  <select
                    value={line.contactId || ""}
                    onChange={(e) => {
                      const newLines = [...lines]
                      newLines[idx].contactId = e.target.value
                      setLines(newLines)
                    }}
                    className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-0 text-[11px]"
                  >
                    <option value="">N/A</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] uppercase text-muted-foreground font-bold whitespace-nowrap">
                    {t("journal.commitment")}:
                  </span>
                  <select
                    value={line.commitmentId || ""}
                    onChange={(e) => {
                      const newLines = [...lines]
                      newLines[idx].commitmentId = e.target.value
                      setLines(newLines)
                    }}
                    className="flex h-7 w-full rounded-md border border-input bg-background px-2 py-0 text-[11px]"
                  >
                    <option value="">N/A</option>
                    {commitments.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.reference} ({formatCurrency(c.amount)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setLines([...lines, { accountId: "", debitAmount: "", creditAmount: "", description: "" }])
              }
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("journal.addLine")}
            </Button>

            <div className="flex gap-8 px-4 py-2 bg-muted/50 rounded-lg border">
              <div className="text-right">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">{t("journal.debit")}</p>
                <p className="text-sm font-bold">{formatCurrency(totalDebits)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">{t("journal.credit")}</p>
                <p className="text-sm font-bold">{formatCurrency(totalCredits)}</p>
              </div>
              <div className="text-right border-l pl-8">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">
                  {isBalanced ? t("journal.balanced") : t("journal.difference")}
                </p>
                <p className={cn("text-sm font-bold", !isBalanced && "text-destructive")}>
                  {isBalanced ? "✓" : formatCurrency(Math.abs(totalDebits - totalCredits))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("journal.cancel")}
        </Button>
        <Button type="submit" disabled={loading || !isBalanced} className="px-8">
          {loading ? t("journal.saving") : t("journal.save")}
        </Button>
      </div>
    </form>
  )
}
