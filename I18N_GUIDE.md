# Multilingual Support Guide

## Overview

The mou7asib financial system is fully set up for multilingual support using **next-intl**, a robust Next.js internationalization library. The system is currently configured for English (en) and Arabic (ar), but is easily extensible to support additional languages.

## Architecture

### Key Files and Directories

```
src/
├── i18n.ts                          # Language configuration
├── proxy.ts                         # Middleware for locale routing
└── app/
    ├── layout.tsx                   # Root layout
    ├── page.tsx                     # Home redirect
    └── [locale]/                    # Dynamic locale segment
        ├── layout.tsx               # Locale-wrapped layout
        └── (authenticated)/         # Protected routes
            ├── dashboard/
            ├── accounts/
            ├── journal/
            ├── ledger/
            ├── contacts/
            ├── invoices/
            ├── commitments/
            ├── periods/
            ├── reports/
            ├── audit-log/
            └── settings/

public/
└── locales/
    ├── en.json                      # English translations
    └── ar.json                      # Arabic translations

components/
└── layout/
    └── language-switcher.tsx        # Language selection component
```

### Supported Languages

| Code | Language | Direction | Status |
|------|----------|-----------|--------|
| `en` | English  | LTR       | ✓ Active |
| `ar` | العربية (Arabic) | RTL | ✓ Active |

## How It Works

### 1. **URL Routing**

All routes are prefixed with the locale code:
- English: `http://localhost:3000/en/dashboard`
- Arabic: `http://localhost:3000/ar/dashboard`

The system automatically:
- Detects the user's preferred language from the URL
- Defaults to English if no locale is specified
- Redirects to the appropriate localized page

### 2. **Language Switcher**

Located in the header, the language switcher allows users to toggle between languages while preserving their current page and navigation state.

```tsx
<LanguageSwitcher />  // Located in HeaderBar component
```

### 3. **Middleware (Proxy)**

The `src/proxy.ts` file handles:
- Route matching for locale prefixes
- Locale detection and routing
- RTL/LTR document direction management

### 4. **Translation Files**

Translations are stored in JSON format:

```json
// public/locales/en.json
{
  "nav": {
    "dashboard": "Dashboard",
    "accounts": "Chart of Accounts",
    ...
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    ...
  }
}
```

## Usage in Components

### Client Components

Use the `useTranslations` hook to access translations:

```tsx
"use client";

import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations();

  return (
    <h1>{t("dashboard.welcome")}</h1>
    <p>{t("dashboard.subtitle")}</p>
  );
}
```

### Server Components

Server components automatically have access to translations through the layout:

```tsx
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();
  
  return <h1>{t("page.title")}</h1>;
}
```

### Accessing Locale Information

Get the current locale in components:

```tsx
import { useLocale } from "next-intl";

export function MyComponent() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const isEnglish = locale === "en";
  
  return <div dir={isArabic ? "rtl" : "ltr"}>...</div>;
}
```

## Adding a New Language

### Step 1: Create Translation File

Create `public/locales/[code].json` with all translation keys:

```bash
cp public/locales/en.json public/locales/fr.json
# Then edit fr.json with French translations
```

### Step 2: Update i18n Configuration

Update `src/i18n.ts`:

```ts
export const locales = ["en", "ar", "fr"] as const;
export const defaultLocale = "en" as const;
```

### Step 3: Update Proxy Configuration

Update `src/proxy.ts` matcher:

```ts
export const config = {
  matcher: [
    "/",
    "/(en|ar|fr)/:path*",  // Add new locale
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
```

That's it! The new language is now available at `/fr/*` URLs.

## Translation Structure

The translation files are organized by feature:

- `nav` - Navigation menu items
- `common` - Common UI text (buttons, labels, messages)
- `dashboard` - Dashboard page text
- `accounts` - Chart of Accounts text
- `journal` - Journal Entries text
- `ledger` - General Ledger text
- `contacts` - Contacts management text
- `invoices` - Invoice system text
- `commitments` - Budget Commitments text
- `periods` - Fiscal Periods text
- `reports` - Reports text
- `auditLog` - Audit Log text
- `settings` - Settings text
- `errors` - Error messages
- `validation` - Validation messages

## Best Practices

### 1. **Consistent Key Naming**

Use dot notation for nested keys:
```json
{
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome"
  }
}
```

Access as: `t("dashboard.title")`

### 2. **Maintain Parity**

Keep all translation files synchronized with the same structure and keys.

### 3. **Avoid Hardcoded Text**

❌ Don't:
```tsx
<button>Save</button>
```

✅ Do:
```tsx
<button>{t("common.save")}</button>
```

### 4. **Handle Missing Translations**

The system gracefully falls back to key names if translations are missing:
```tsx
t("missing.key") // Returns "missing.key"
```

### 5. **RTL Support**

Arabic text automatically:
- Reverses page direction with `dir="rtl"`
- Mirrors layout and spacing
- Flips icons appropriately (use images in locales folder if needed)

## Language Switcher Features

The language switcher component (`LanguageSwitcher`):

- ✓ Maintains current page when switching languages
- ✓ Updates document direction (LTR/RTL)
- ✓ Provides visual feedback of active language
- ✓ Works on all protected routes
- ✓ Smooth navigation without page reload

```tsx
// Located in: src/components/layout/language-switcher.tsx
<Button onClick={() => switchLanguage("en")}>English</Button>
<Button onClick={() => switchLanguage("ar")}>العربية</Button>
```

## Customizing Language Names

Edit the LanguageSwitcher component to customize display:

```tsx
// In language-switcher.tsx
<Button onClick={() => switchLanguage("en")}>
  English
</Button>
<Button onClick={() => switchLanguage("ar")}>
  العربية (Arabic)
</Button>
```

## Environment Variables

No specific i18n environment variables are required. The system uses:

- Route parameters for locale detection
- JSON files in the `public` folder for translations
- Next.js middleware (proxy) for routing

## Troubleshooting

### Language Not Switching

1. Clear browser cache and cookies
2. Verify URL has correct locale prefix: `/en/` or `/ar/`
3. Check browser console for errors
4. Ensure translation files exist in `public/locales/`

### Missing Translations

1. Check translation file syntax (valid JSON)
2. Verify key name matches usage in component
3. Check for typos in namespace/key path
4. Review `public/locales/` folder contents

### RTL Issues

1. Verify `dir` attribute in HTML tag
2. Check layout for `margin-left/right` conflicts
3. Use logical properties: `margin-inline`, `padding-block`
4. Test with both LTR and RTL languages

## Performance Considerations

- Translation files are loaded per-locale at build time
- No runtime translation processing overhead
- Static exports possible with pre-built locale paths
- Locale detection happens at the proxy level (minimal overhead)

## Testing Multilingual Features

### Manual Testing

1. Navigate to `/en/dashboard` and `/ar/dashboard`
2. Switch languages using header button
3. Verify all text translates correctly
4. Check RTL layout in Arabic mode
5. Test on mobile with different screen sizes

### Automated Testing

Consider adding tests for:
- Language switcher functionality
- Translation key coverage
- RTL/LTR rendering
- Missing translation handling

## Next Steps

1. Add more languages by following "Adding a New Language" section
2. Customize translations for your business terms
3. Add regional variants (e.g., `en-US`, `en-GB`)
4. Implement language persistence (localStorage or cookies)
5. Consider adding language selector in settings page

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [RTL Styling Guidelines](https://rtlstyling.com/)

---

**Current Build Status**: ✓ Multilingual support is fully integrated and tested. All routes support both English and Arabic.
