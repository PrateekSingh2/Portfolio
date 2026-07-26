export type ProjectCategory = "ALL" | "AI/ML/DL" | "WebDev";

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  challenges: string;
  metrics: string;
  tech: string[];
  github: string;
  live: string;
  linkedin?: string;
  category: "AI/ML/DL" | "WebDev";
  thumbnail: string;
  featured?: boolean;
}

export const PROJECTS_DATA: Project[] = [
  
  {
    id: "formforge",
    title: "FormForge: AI-Assisted Dynamic Form Builder",
    category: "WebDev",
    featured: true,
    thumbnail: "https://ik.imagekit.io/g7e4hyclo/formforge.png",
    shortDesc: "A web application allowing users to create dynamic forms with AI-assisted prompt interactions, schema validation, and real-time live preview rendering.",
    description: "FormForge simplifies complex multi-step form creation using generative AI prompts, customizable field validation schemas, and real-time live preview rendering.",
    challenges: "Ensuring real-time state consistency across nested form structures while maintaining sub-50ms reactive input updates.",
    metrics: "Reduced form generation setup time by 50% with 95% prompt completion accuracy across test user cohorts.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Groq"],
    github: "https://github.com/PrateekSingh2/formsforge",
    live: "https://formsforge-coral.vercel.app/",
  },
  {
    id: "blo",
    title: "BLO: Virtual Voter Card System",
    category: "WebDev",
    featured: true,
    thumbnail: "https://media.licdn.com/dms/image/v2/D562DAQEmy45Jm6zS1Q/profile-treasury-image-shrink_480_480/B56ZhhRgIpG0AM-/0/1753978638084?e=1785700800&v=beta&t=EJXBTFdIKxiUWM3LD9FM_pUKVk6DASRpoQikS3W1tN0",
    shortDesc: "A desktop application engineered for local generation of virtual voter cards.",
    description: "BLO (Booth Level Officer) virtual voter system provides secure local ID generation, and user auth and record management with offline-first MySQL storage.",
    challenges: "Designing an offline-first desktop UI with Tkinter, securing local databases, and generating vector print-ready image export cards.",
    metrics: "Streamlined local election voter verification workflow with 100% offline uptime and zero data leakage.",
    tech: ["Python", "Tkinter", "MySQL", "PIL"],
    github: "https://github.com/PrateekSingh2/BLO",
    live: "",
  },
  {
    id: "portfolio",
    title: "Real-Time Algorithmic Developer Portfolio",
    category: "WebDev",
    featured: false,
    thumbnail: "https://ik.imagekit.io/g7e4hyclo/portfolio.png",
    shortDesc: "A high-performance portfolio featuring live GraphQL scraping, Recharts analytics, competitive programming platform integrations, and micro-interactions.",
    description: "Architected with Next.js App Router, custom REST/GraphQL API proxy routes, RegExp HTML scrapers for competitive programming platforms, and real-time commit feeds.",
    challenges: "Scraping non-API competitive profiles, optimizing client bundle size, and ensuring smooth glassmorphism rendering across mobile browsers.",
    metrics: "100% TypeScript type safety, 0 runtime lint errors, sub-second API caching with Next.js SWR revalidation.",
    tech: ["Next.js 15", "TypeScript", "Recharts", "Tailwind CSS", "GraphQL"],
    github: "https://github.com/PrateekSingh2/Portfolio",
    live: "https://rajawatprateek.netlify.app/",
  },
];
