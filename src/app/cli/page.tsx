import type { Metadata } from "next";
import { CliTerminalClient } from "@/components/sections/CliTerminalClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

export const metadata: Metadata = {
  title: "Interactive Developer Terminal (CLI)",
  description:
    "Interactive UNIX-style developer terminal CLI portfolio of Prateek Singh. Explore architecture projects, competitive programming ratings, and system stacks via command line.",
  openGraph: {
    title: "Interactive Developer Terminal (CLI) | Prateek Singh",
    description:
      "Interactive UNIX-style developer terminal CLI portfolio of Prateek Singh. Explore architecture projects, competitive programming ratings, and system stacks via command line.",
    url: `${siteUrl}/cli`,
    type: "website",
    images: [
      {
        url: "/api/og?title=Interactive Developer Terminal (CLI)&type=default&desc=Explore architecture projects, CP ratings, and system stacks via command line.",
        width: 1200,
        height: 630,
        alt: "Prateek Singh Developer CLI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Developer Terminal (CLI) | Prateek Singh",
    description:
      "Explore software systems, engineering case studies, and competitive programming via command line.",
    images: [
      "/api/og?title=Interactive Developer Terminal (CLI)&type=default&desc=Explore architecture projects, CP ratings, and system stacks via command line.",
    ],
  },
};

export default function CliPage() {
  return <CliTerminalClient />;
}
