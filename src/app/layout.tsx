import type { Metadata } from "next";
import "./globals.css";
import { IndustryProvider } from "@/context/IndustryContext";

export const metadata: Metadata = {
  title: "Digyverse BI - Premium Business Intelligence Dashboard",
  description: "Next-generation analytics dashboard for healthcare and enterprise operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa] font-sans">
        <IndustryProvider>
          {children}
        </IndustryProvider>
      </body>
    </html>
  );
}

