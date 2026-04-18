"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  FileText,
  Grid2X2,
  Package,
  Settings,
  Users,
  Wallet,
  LogOut,
  TrendingUp,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/accounts", label: "Chart of Accounts", icon: Grid2X2 },
  { href: "/journal", label: "Journal Entries", icon: BookOpen },
  { href: "/ledger", label: "General Ledger", icon: FileText },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/commitments", label: "Budget Commitments", icon: Wallet },
  { href: "/periods", label: "Fiscal Periods", icon: Package },
  { href: "/reports", label: "Reports", icon: TrendingUp },
  { href: "/audit-log", label: "Audit Log", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">mou7asib</h1>
        <p className="text-xs text-muted-foreground">Financial System</p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-auto space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start gap-3">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
