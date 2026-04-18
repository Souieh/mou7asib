import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LedgerPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {t("ledger.title")}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("ledger.accountLedger")}</CardTitle>
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
