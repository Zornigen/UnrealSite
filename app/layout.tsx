import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const abaddon = localFont({
  src: "../public/fonts/abaddon.otf",
  variable: "--font-abaddon",
  display: "swap",
});

const beaufort = localFont({
  src: [
    {
      path: "../public/fonts/BeaufortforLOL-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/BeaufortforLOL-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/BeaufortforLOL-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/BeaufortforLOL-Heavy.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-beaufort",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Serious Engine 1.5 -> Unreal Engine 5.7",
  description: "Кинематографичный лендинг о переходе проекта на Unreal Engine 5.7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${abaddon.variable} ${beaufort.variable} antialiased`}>{children}</body>
    </html>
  );
}
