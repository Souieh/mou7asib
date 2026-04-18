"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AccountForm } from "@/components/modules/accounts/account-form"

export default function AccountsPage() {
  const [showForm, setShowForm] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/accounts")
      const data = await res.json()
      setAccounts(data)
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAccounts = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chart of Accounts</h1>
          <p className="text-sm text-muted-foreground">Manage your account structure</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Account
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountForm
              onSuccess={() => {
                setShowForm(false)
                fetchAccounts()
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Accounts</CardTitle>
          <Input
            placeholder="Search by code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Normal Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium text-xs">{account.code}</TableCell>
                  <TableCell className="text-xs">{account.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{account.normalBalance}</TableCell>
                  <TableCell>
                    <Badge variant={account.isActive ? "default" : "secondary"} className="text-xs">
                      {account.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
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
