"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export default function ContactsPage() {
  const [showForm, setShowForm] = useState(false)
  const [contacts, setContacts] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    try {
      const res = await fetch("/api/contacts")
      const data = await res.json()
      setContacts(data)
    } catch (error) {
      console.error("Failed to fetch contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-sm text-muted-foreground">Manage customers and suppliers</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Contacts</CardTitle>
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium text-xs">{contact.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {contact.contactType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{contact.email || "-"}</TableCell>
                  <TableCell className="text-xs">{contact.phone || "-"}</TableCell>
                  <TableCell className="text-xs font-medium">{formatCurrency(contact.balance)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
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
