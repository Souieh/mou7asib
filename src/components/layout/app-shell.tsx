"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { SidebarNav } from "./sidebar-nav"
import { HeaderBar } from "./header"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } border-r border-border transition-all duration-300 overflow-hidden`}
      >
        <SidebarNav />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <HeaderBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
