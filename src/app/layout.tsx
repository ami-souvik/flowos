import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import DashboardShell from "@/components/layout/DashboardShell";

const archivo = Archivo({
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "CRM Dashboard",
  description: "A cool CRM application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.className} antialiased`}
      >
        <DashboardShell>
          {children}
        </DashboardShell>
      </body>
    </html>
  );
}