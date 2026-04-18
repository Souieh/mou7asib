import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CommitmentsPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t("commitments.title")}</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t("commitments.createCommitment")}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("commitments.title")}</CardTitle>
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
