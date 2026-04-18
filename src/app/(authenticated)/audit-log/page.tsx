"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    try {
      const res = await fetch("/api/audit-log")
      const data = await res.json()
      setLogs(data)
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entityType.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm text-muted-foreground">Track all system changes and user actions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activity Log</CardTitle>
          <Input
            placeholder="Search by action or entity type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Entity ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs">{formatDate(log.createdAt)}</TableCell>
                    <TableCell className="text-xs">{log.user.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{log.entityType}</TableCell>
                    <TableCell className="text-xs font-mono">{log.entityId}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-xs text-muted-foreground">
                    No audit logs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
