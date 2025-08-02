import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FitYas- Your Personal Fitness Journey",
  description: "Enter and follow your workout plan through the app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
