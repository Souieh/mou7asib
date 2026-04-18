"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderBarProps {
  onToggleSidebar: () => void
}

export function HeaderBar({ onToggleSidebar }: HeaderBarProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-semibold">Company Name</h1>
            <p className="text-xs text-muted-foreground">FY 2024</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">
            JD
          </div>
        </div>
      </div>
    </header>
  )
}
