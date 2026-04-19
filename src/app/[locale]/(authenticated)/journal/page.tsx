"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { JournalEntryForm } from "@/components/modules/journal/journal-entry-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function JournalPage() {
  const t = useTranslations()
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    try {
      const res = await fetch("/api/journal-entries")
      if (res.ok) {
        setEntries(await res.json())
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    fetchEntries()
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("journal.title")}
          </h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("journal.createEntry")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{t("journal.newEntry")}</DialogTitle>
            </DialogHeader>
            <JournalEntryForm
              onSuccess={handleSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("journal.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("journal.date")}</TableHead>
                  <TableHead>{t("journal.reference")}</TableHead>
                  <TableHead>{t("journal.description")}</TableHead>
                  <TableHead className="text-right">{t("journal.amount")}</TableHead>
                  <TableHead className="text-center">{t("journal.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => {
                  const totalAmount = entry.lines.reduce(
                    (sum: number, line: any) => sum + (line.debitAmount || 0),
                    0
                  )
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">
                        {new Date(entry.entryDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.reference || "-"}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={entry.status === "POSTED" ? "default" : "secondary"}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              {t("journal.noEntries")}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
