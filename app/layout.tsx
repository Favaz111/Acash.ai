import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acash.ai - مساعدك المالي الذكي",
  description: "منصة مالية ذكية تمكّنك من تحقيق الاستقلال المالي من خلال أدوات ذكية ومساعد مالي شخصي",
  keywords: ["إدارة مالية", "تخطيط مالي", "ذكاء اصطناعي", "مساعد مالي", "استقلال مالي"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
