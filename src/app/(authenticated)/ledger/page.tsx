"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function LedgerPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAccounts()
  }, [])

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/accounts")
      const data = await res.json()
      setAccounts(data)
      if (data.length > 0) {
        setSelectedAccount(data[0])
        fetchLedger(data[0].id)
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLedger(accountId: number) {
    try {
      const res = await fetch(`/api/ledger?accountId=${accountId}`)
      const data = await res.json()
      setLedgerEntries(data)
    } catch (error) {
      console.error("Failed to fetch ledger:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">General Ledger</h1>
        <p className="text-sm text-muted-foreground">View account transactions and balances</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Account List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-auto">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setSelectedAccount(acc)
                    fetchLedger(acc.id)
                  }}
                  className={`w-full text-left p-2 rounded text-xs transition-colors ${
                    selectedAccount?.id === acc.id
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="font-medium">{acc.code}</div>
                  <div className="text-muted-foreground">{acc.name}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ledger Details */}
        <Card className="lg:col-span-3">
          {selectedAccount ? (
            <>
              <CardHeader>
                <CardTitle className="text-sm">{selectedAccount.name}</CardTitle>
                <CardDescription>{selectedAccount.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted rounded flex justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(5000)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{selectedAccount.type}</Badge>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-right text-xs">Debit</TableHead>
                      <TableHead className="text-right text-xs">Credit</TableHead>
                      <TableHead className="text-right text-xs">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ledgerEntries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs">{formatDate(entry.entryDate)}</TableCell>
                        <TableCell className="text-xs">{entry.description}</TableCell>
                        <TableCell className="text-right text-xs">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : ""}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : ""}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">
                          {formatCurrency(entry.runningBalance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Select an account to view ledger</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
