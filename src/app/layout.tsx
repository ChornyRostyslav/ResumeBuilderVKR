import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ІТ Конструктор Резюме",
  description: "Створіть професійне ІТ-резюме",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-neutral-50 antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
