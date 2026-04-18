import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(150000)}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3" /> +12.5%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Liabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45000)}</div>
            <p className="text-xs text-muted-foreground mt-2">Current obligations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Month Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(28500)}</div>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3" /> +8.2%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Month Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(12300)}</div>
            <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
              <TrendingDown className="h-3 w-3" /> -3.1%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Journal Entries</CardTitle>
            <CardDescription>Latest 5 entries</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: "Jan 15, 2024", desc: "Office Supplies", amount: 250, status: "Posted" },
                  { date: "Jan 14, 2024", desc: "Client Invoice #001", amount: 5000, status: "Posted" },
                  { date: "Jan 13, 2024", desc: "Utilities Payment", amount: 450, status: "Pending" },
                ].map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{entry.date}</TableCell>
                    <TableCell className="text-xs">{entry.desc}</TableCell>
                    <TableCell className="text-xs font-medium">{formatCurrency(entry.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={entry.status === "Posted" ? "default" : "secondary"}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>2 entries waiting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: 1, desc: "Utilities", amount: 450 },
              { id: 2, desc: "Travel Expense", amount: 850 },
            ].map((entry) => (
              <div key={entry.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <p className="text-xs font-medium">{entry.desc}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(entry.amount)}</p>
                </div>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
