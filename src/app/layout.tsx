import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "mou7asib - Financial Management",
  description: "Scalable financial management system with journal entries, general ledger, and reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
