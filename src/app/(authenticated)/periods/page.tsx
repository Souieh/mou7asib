"use client"

import { useState, useEffect } from "react"
import { Plus, Lock, Unlock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPeriods()
  }, [])

  async function fetchPeriods() {
    try {
      const res = await fetch("/api/periods")
      const data = await res.json()
      setPeriods(data)
    } catch (error) {
      console.error("Failed to fetch periods:", error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, "default" | "secondary"> = {
    OPEN: "default",
    CLOSED: "secondary",
    LOCKED: "secondary",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fiscal Periods</h1>
          <p className="text-sm text-muted-foreground">Manage accounting periods</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Period
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.id}>
                  <TableCell className="font-medium text-xs">{period.name}</TableCell>
                  <TableCell className="text-xs">{formatDate(period.startDate)}</TableCell>
                  <TableCell className="text-xs">{formatDate(period.endDate)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[period.status]} className="text-xs">
                      {period.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {period.status === "OPEN" ? (
                      <Button variant="ghost" size="sm">
                        <Lock className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Unlock className="h-3 w-3" />
                      </Button>
                    )}
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
