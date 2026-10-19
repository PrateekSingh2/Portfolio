import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prateeksingh.dev";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Prateek Singh for software engineering opportunities, technical consulting, or system design collaborations.",
  openGraph: {
    title: "Contact | Prateek Singh",
    description:
      "Connect with Prateek Singh for engineering opportunities, competitive programming, and technical collaborations.",
    url: `${siteUrl}/contact`,
    type: "website",
    images: [
      {
        url: "/images/profile.png",
        width: 800,
        height: 800,
        alt: "Contact Prateek Singh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Prateek Singh",
    description:
      "Get in touch with Prateek Singh for software engineering collaborations.",
    images: ["/images/profile.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
