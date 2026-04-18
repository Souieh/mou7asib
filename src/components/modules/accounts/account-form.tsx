"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccountFormProps {
  onSuccess: () => void
  onCancel: () => void
  account?: any
}

export function AccountForm({ onSuccess, onCancel, account }: AccountFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: account?.code || "",
    name: account?.name || "",
    nameAr: account?.nameAr || "",
    type: account?.type || "ASSET",
    normalBalance: account?.normalBalance || "DEBIT",
    isActive: account?.isActive ?? true,
    requiresCommitment: account?.requiresCommitment ?? false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const url = account ? `/api/accounts/${account.id}` : "/api/accounts"
      const method = account ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving account:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Code</label>
          <Input
            placeholder="1000"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
          >
            <option>ASSET</option>
            <option>LIABILITY</option>
            <option>EQUITY</option>
            <option>REVENUE</option>
            <option>EXPENSE</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium">Name (English)</label>
        <Input
          placeholder="Account Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-xs font-medium">Name (Arabic)</label>
        <Input
          placeholder="اسم الحساب"
          value={formData.nameAr}
          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium">Normal Balance</label>
          <select
            value={formData.normalBalance}
            onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
          >
            <option>DEBIT</option>
            <option>CREDIT</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border border-input"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={formData.requiresCommitment}
            onChange={(e) => setFormData({ ...formData, requiresCommitment: e.target.checked })}
            className="rounded border border-input"
          />
          Requires Commitment
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Account"}
        </Button>
      </div>
    </form>
  )
}
