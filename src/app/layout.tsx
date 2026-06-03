import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "../context/DataContext";
import { IndustryProvider } from "../context/IndustryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digyverse BI MVP",
  description: "Dynamic Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We wrap the app in BOTH providers now */}
        <IndustryProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </IndustryProvider>
      </body>
    </html>
  );
}