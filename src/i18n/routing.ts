import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // اللغات المدعومة
  locales: ['en', 'ar'],

  // اللغة الافتراضية عند عدم تطابق اللغة في المسار
  defaultLocale: 'en',
});

// تصدير أدوات التنقل المتوافقة مع اللغات
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
