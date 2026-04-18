"use client"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { useTranslations } from "next-intl"
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

const navItemKeys = [
  { href: "dashboard", key: "nav.dashboard", icon: BarChart3 },
  { href: "accounts", key: "nav.accounts", icon: Grid2X2 },
  { href: "journal", key: "nav.journal", icon: BookOpen },
  { href: "ledger", key: "nav.ledger", icon: FileText },
  { href: "contacts", key: "nav.contacts", icon: Users },
  { href: "invoices", key: "nav.invoices", icon: FileText },
  { href: "commitments", key: "nav.commitments", icon: Wallet },
  { href: "periods", key: "nav.periods", icon: Package },
  { href: "reports", key: "nav.reports", icon: TrendingUp },
  { href: "audit-log", key: "nav.auditLog", icon: Lock },
  { href: "settings", key: "nav.settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations()

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">mou7asib</h1>
        <p className="text-xs text-muted-foreground">Financial System</p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-auto space-y-1 p-4">
        {navItemKeys.map((item) => {
          const Icon = item.icon
          const isActive = pathname.includes(`/${item.href}`)
          const href = `/${locale}/${item.href}`
          return (
            <Link key={item.href} href={href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{t(item.key)}</span>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full justify-start gap-3">
          <LogOut className="h-4 w-4" />
          <span>{t("common.logout")}</span>
        </Button>
      </div>
    </div>
  )
}
