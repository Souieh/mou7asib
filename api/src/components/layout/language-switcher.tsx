"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    // Replace locale in pathname
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(newPathname);
  };

  // Only show the switcher if we have multiple locales.
  // Since we currently only support English, we'll hide it or just show English.
  // For now, let's keep it but only show English to confirm it's working.

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
      <Button
        variant="default"
        size="sm"
        onClick={() => switchLanguage("en")}
        className="h-8 px-3"
      >
        <Globe className="w-3.5 h-3.5 mr-1.5" />
        <span>English</span>
      </Button>
    </div>
  );
}
