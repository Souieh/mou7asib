import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "mou7asib - Financial Management",
  description: "Scalable financial management system with journal entries, general ledger, and reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
