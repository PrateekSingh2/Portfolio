import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Engineering case studies and software projects by Prateek Singh: AlgoLib, DecodeLabs, FormForge, distributed engines, and AI applications.",
  openGraph: {
    title: "Projects | Prateek Singh",
    description:
      "Explore software systems, full-stack architectures, algorithms, and cloud deployments by Prateek Singh.",
    url: `${siteUrl}/projects`,
    type: "website",
    images: [
      {
        url: "/images/profile.png",
        width: 800,
        height: 800,
        alt: "Prateek Singh Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Prateek Singh",
    description:
      "Engineering case studies and software projects by Prateek Singh.",
    images: ["/images/profile.png"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
