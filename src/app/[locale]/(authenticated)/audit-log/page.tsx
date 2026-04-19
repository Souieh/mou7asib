import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuditLogPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{t("auditLog.title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("auditLog.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-8">
            {t("common.noData")}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
