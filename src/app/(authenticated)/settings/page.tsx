import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your system configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium">Company Name</label>
              <Input placeholder="Your Company Name" />
            </div>
            <div>
              <label className="text-xs font-medium">Fiscal Year Start</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-xs font-medium">Accounting Basis</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs">
                <option>Commercial</option>
                <option>Budgetary</option>
                <option>Hybrid</option>
              </select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>System details and statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Version</span>
              <span className="text-xs font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Database Size</span>
              <span className="text-xs font-medium">12.5 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Last Backup</span>
              <span className="text-xs font-medium">Today at 2:30 PM</span>
            </div>
          </CardContent>
        </Card>

        {/* Users & Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Users & Permissions</CardTitle>
            <CardDescription>Manage user access and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Manage Users
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
