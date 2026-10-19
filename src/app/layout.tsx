import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { Providers } from "@/components/providers/Providers";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";
import { CatFollower } from "@/components/ui/CatFollower";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Prateek Singh | Software Systems Engineer & Competitive Programmer",
    template: "%s | Prateek Singh",
  },
  description:
    "Personal portfolio and engineering journal of Prateek Singh. Specializing in high-performance backend systems, distributed architectures, and competitive programming (CodeChef 3★, LeetCode Knight).",
  keywords: [
    "Prateek Singh",
    "Prateek Singh Portfolio",
    "Competitive Programming",
    "Software Engineer",
    "Systems Engineer",
    "CodeChef nice_trail_87",
    "LeetCode prateek_singh7",
    "Codeforces RajawatPrateekSingh",
    "Full Stack Developer",
    "Distributed Systems",
    "Golang",
    "React",
    "Next.js",
    "TypeScript",
    "Engineering Blog",
    "Data Structures and Algorithms",
  ],
  authors: [{ name: "Prateek Singh", url: siteUrl }],
  creator: "Prateek Singh",
  publisher: "Prateek Singh",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Prateek Singh | Portfolio & Engineering Journal",
    title: "Prateek Singh | Software Systems Engineer & Competitive Programmer",
    description:
      "Explore software systems, engineering case studies, competitive programming trajectories, and technical articles by Prateek Singh.",
    images: [
      {
        url: "/images/profile.png",
        width: 800,
        height: 800,
        alt: "Prateek Singh - Software Systems Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prateek Singh | Software Systems Engineer",
    description:
      "Software Systems Engineer & Competitive Programmer. Systems architecture, algorithms, and technical engineering journal.",
    images: ["/images/profile.png"],
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Prateek Singh",
      url: siteUrl,
      image: `${siteUrl}/images/profile.png`,
      jobTitle: "Software Systems Engineer & Competitive Programmer",
      knowsAbout: [
        "Distributed Systems",
        "Competitive Programming",
        "Algorithms & Data Structures",
        "Golang",
        "React",
        "Next.js",
        "PostgreSQL",
        "Cloud Architecture",
      ],
      sameAs: [
        "https://github.com/PrateekSingh2",
        "https://leetcode.com/u/prateek_singh7/",
        "https://www.codechef.com/users/nice_trail_87",
        "https://codeforces.com/profile/RajawatPrateekSingh",
        "https://www.geeksforgeeks.org/profile/rajawatprateeksingh",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Prateek Singh Portfolio",
      publisher: {
        "@id": `${siteUrl}/#person`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} ${caveat.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-clip">
        <Providers>
          <InteractiveBackground />
          <div className="hidden lg:block">
            <CatFollower />
          </div>
          <ScrollToTop />
          <TooltipProvider>
            <div className="hidden md:block">
              <ScrollProgress />
            </div>
            <Navbar />

            <main className="flex-1 flex flex-col overflow-x-clip">{children}</main>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
