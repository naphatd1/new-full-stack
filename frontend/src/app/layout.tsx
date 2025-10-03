import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers/Providers";

import { ToastProvider } from "@/components/ui/toast-provider";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HouseMarket - แพลตฟอร์มซื้อขายบ้านออนไลน์",
  description:
    "ค้นหาและขายบ้านในฝันของคุณได้ง่ายๆ บน HouseMarket แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์ที่ใหญ่ที่สุดในประเทศไทย",
  keywords: "ขายบ้าน, ซื้อบ้าน, อสังหาริมทรัพย์, บ้านเดี่ยว, ทาวน์เฮาส์, คอนโด",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
