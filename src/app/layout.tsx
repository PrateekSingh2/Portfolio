import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prateek Singh | Portfolio",
  description: "Portfolio of Prateek Singh, aspiring software engineer and competitive programmer. Showcasing projects, skills, and achievements in algorithms, systems, and software development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
        <Providers>
          <TooltipProvider>
            <ScrollProgress />
            <Navbar />

            <main className="flex-1 flex flex-col overflow-x-hidden">{children}</main>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
