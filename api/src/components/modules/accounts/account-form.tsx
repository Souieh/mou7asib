"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

interface AccountFormProps {
  onSuccess: () => void
  onCancel: () => void
  account?: any
}

export function AccountForm({ onSuccess, onCancel, account }: AccountFormProps) {
  const t = useTranslations()
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
        <div className="space-y-1">
          <label className="text-xs font-medium">{t("accounts.accountCode")}</label>
          <Input
            placeholder="e.g. 1000"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">{t("accounts.accountType")}</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="ASSET">{t("accounts.assets")}</option>
            <option value="LIABILITY">{t("accounts.liabilities")}</option>
            <option value="EQUITY">{t("accounts.equity")}</option>
            <option value="REVENUE">{t("accounts.revenue")}</option>
            <option value="EXPENSE">{t("accounts.expense")}</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium">{t("accounts.accountName")} (EN)</label>
        <Input
          placeholder="Account Name in English"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-1 text-right">
        <label className="text-xs font-medium block">{t("accounts.accountName")} (AR)</label>
        <Input
          placeholder="اسم الحساب بالعربية"
          value={formData.nameAr}
          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
          dir="rtl"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium">{t("accounts.normalBalance")}</label>
          <select
            value={formData.normalBalance}
            onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="DEBIT">{t("accounts.debit")}</option>
            <option value="CREDIT">{t("accounts.credit")}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="size-4 rounded border border-input text-primary focus:ring-primary"
          />
          {t("accounts.isActive")}
        </label>
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={formData.requiresCommitment}
            onChange={(e) => setFormData({ ...formData, requiresCommitment: e.target.checked })}
            className="size-4 rounded border border-input text-primary focus:ring-primary"
          />
          {t("accounts.requiresCommitment")}
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={loading} className="px-8">
          {loading ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </form>
  )
}
