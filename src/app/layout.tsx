import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniSales AI",
  description: "AI-powered sales, CRM and collections platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 antialiased">{children}</body>
    </html>
  );
}
