import { BarChart3, TrendingUp, DollarSign, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const reports = [
  {
    title: "Income Statement",
    description: "Revenue minus expenses to show profitability",
    icon: TrendingUp,
  },
  {
    title: "Balance Sheet",
    description: "Assets = Liabilities + Equity snapshot",
    icon: DollarSign,
  },
  {
    title: "Cash Flow Statement",
    description: "Operating, investing, and financing activities",
    icon: BarChart3,
  },
  {
    title: "Trial Balance",
    description: "All accounts with their debit/credit balances",
    icon: FileText,
  },
  {
    title: "Budget Execution",
    description: "Budget vs Actual vs Commitment analysis",
    icon: BarChart3,
  },
  {
    title: "Audit Trail",
    description: "Complete log of all system changes and actions",
    icon: FileText,
  },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <p className="text-sm text-muted-foreground">Generate and view financial reports</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, idx) => {
          const Icon = report.icon
          return (
            <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                  <Icon className="h-5 w-5 text-accent opacity-50" />
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  Generate
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
