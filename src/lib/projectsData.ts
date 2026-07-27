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
    id: "algolib",
    title: "AlgoLib: DSA Visualizer and Learning Platform",
    category: "WebDev",
    featured: true,
    thumbnail:
      "https://ik.imagekit.io/g7e4hyclo/Screenshot%202026-07-28%20001729.png",
    shortDesc:
      "A complete product for visualizing DSA/ML algorithms, live contest, online compiler, snippet library and AI-powered learning support.",
    description:
      "AlgoLib is a complete product for visualizing and learning DSA/ML algorithms, live contest, online compiler, snippet library, quiz dashboard, personalized AI tutoring.",
    challenges:
      "Ensuring its uptime, performance, and scalability while handling concurrent users and real-time algorithm visualizations and inhouse code execution engine.",
    metrics:
      "Achieved 99.9% uptime, and 50% increase in user understanding of Data Structures and algorithms concepts through interactive visualizations and AI-powered learning support.",
    tech: [
      "React",
      "TypeScript",
      "Express",
      "Groq",
      "HuggingFace",
      "Docker",
      "Supabase",
      "Firebase",
    ],
    github: "https://github.com/PrateekSingh2/algolib3.0",
    live: "https://algolib.netlify.app/",
  },
  {
    id: "formforge",
    title: "FormForge: AI-Assisted Dynamic Form Builder",
    category: "WebDev",
    featured: true,
    thumbnail: "https://ik.imagekit.io/g7e4hyclo/formforge.png",
    shortDesc:
      "A web application allowing users to create dynamic forms with AI-assisted prompt interactions, schema validation, and real-time live preview rendering.",
    description:
      "FormForge simplifies complex multi-step form creation using generative AI prompts, customizable field validation schemas, and real-time live preview rendering.",
    challenges:
      "Ensuring real-time state consistency across nested form structures while maintaining sub-50ms reactive input updates.",
    metrics:
      "Reduced form generation setup time by 50% with 95% prompt completion accuracy across test user cohorts.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "Groq"],
    github: "https://github.com/PrateekSingh2/formsforge",
    live: "https://formsforge-coral.vercel.app/",
  },
  {
    id: "avsarngo",
    title: "Avsar Kids: Simplified Learning App for NGO",
    category: "WebDev",
    featured: false,
    thumbnail:
      "https://ik.imagekit.io/g7e4hyclo/Screenshot%202026-07-28%20001923.png",
    shortDesc:
      "A web application designed to make learning more engaging for young children by providing interactive lessons and activities.",
    description:
      "AvsarNGO is a web application designed to make learning more engaging for young children by providing interactive lessons and activities.",
    challenges:
      "The main challenge was to think in the perspective of young children and create a user-friendly interface that would keep them engaged while learning.",
    metrics:
      "99.9% uptime, sub-100ms response times, and 50% increase in user engagement",
    tech: [
      "React",
      "TypeScript",
      "Zustand",
      "Web Speech API",
      "HTML5 Web Audio API",
    ],
    github: "https://github.com/PrateekSingh2/AvsarNGO",
    live: "https://study-avsar.netlify.app/",
  },
  {
    id: "blo",
    title: "BLO: Virtual Voter Card System",
    category: "WebDev",
    featured: false,
    thumbnail:
      "https://media.licdn.com/dms/image/v2/D562DAQEmy45Jm6zS1Q/profile-treasury-image-shrink_480_480/B56ZhhRgIpG0AM-/0/1753978638084?e=1785700800&v=beta&t=EJXBTFdIKxiUWM3LD9FM_pUKVk6DASRpoQikS3W1tN0",
    shortDesc:
      "A desktop application engineered for local generation of virtual voter cards.",
    description:
      "BLO (Booth Level Officer) virtual voter system provides secure local ID generation, and user auth and record management with offline-first MySQL storage.",
    challenges:
      "Designing an offline-first desktop UI with Tkinter, securing local databases, and generating vector print-ready image export cards.",
    metrics:
      "Streamlined local election voter verification workflow with 100% offline uptime and zero data leakage.",
    tech: ["Python", "Tkinter", "MySQL", "PIL"],
    github: "https://github.com/PrateekSingh2/BLO",
    live: "",
  },
];
