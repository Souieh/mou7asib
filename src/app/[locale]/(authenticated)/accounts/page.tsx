"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2, Edit2, Trash2 } from "lucide-react"
import { AccountForm } from "@/components/modules/accounts/account-form"
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
import { Badge } from "@/components/ui/badge"

export default function AccountsPage() {
  const t = useTranslations()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    setLoading(true)
    try {
      const res = await fetch("/api/accounts")
      if (res.ok) {
        setAccounts(await res.json())
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setEditingAccount(null)
    fetchAccounts()
  }

  const handleEdit = (account: any) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("accounts.title")}
          </h1>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) setEditingAccount(null)
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("accounts.createNew")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? t("accounts.editAccount") : t("accounts.createNew")}
              </DialogTitle>
            </DialogHeader>
            <AccountForm
              account={editingAccount}
              onSuccess={handleSuccess}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingAccount(null)
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("accounts.accountList")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : accounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">{t("accounts.accountCode")}</TableHead>
                  <TableHead>{t("accounts.accountName")}</TableHead>
                  <TableHead>{t("accounts.accountType")}</TableHead>
                  <TableHead className="text-center">{t("accounts.normalBalance")}</TableHead>
                  <TableHead className="text-center">{t("accounts.isActive")}</TableHead>
                  <TableHead className="text-right">{t("common.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-mono font-bold">
                      {account.code}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-xs text-muted-foreground" dir="rtl">
                          {account.nameAr}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{account.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {account.normalBalance}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-8">
              {t("common.noData")}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
