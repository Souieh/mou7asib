"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchLanguage = (newLocale: string) => {
    // Replace locale in pathname
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(newPathname);
  };

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
      <Button
        variant={locale === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("en")}
        className="h-8 px-3"
      >
        <Globe className="w-3.5 h-3.5 mr-1.5" />
        <span>English</span>
      </Button>
      <Button
        variant={locale === "ar" ? "default" : "ghost"}
        size="sm"
        onClick={() => switchLanguage("ar")}
        className="h-8 px-3"
      >
        <Globe className="w-3.5 h-3.5 mr-1.5" />
        <span>العربية</span>
      </Button>
    </div>
  );
}
