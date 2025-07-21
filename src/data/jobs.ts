export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  duration: string;
  stipend: string;
  postedAt: string;
  deadline: string;
  applicants: number;
  status: "Open" | "Closed" | "active";
  benefits: string[];
  
}

export const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    companyId: "1",
    companyName: "TechFlow Solutions",
    companyLogo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop",
    description: "Join our dynamic frontend team to build cutting-edge user interfaces for our SaaS platform. You'll work with React, TypeScript, and modern development tools while collaborating with designers and backend developers.",
    requirements: [
      "Currently pursuing Computer Science or related field",
      "Strong foundation in JavaScript and React",
      "Experience with responsive web design",
      "Understanding of version control (Git)",
      "Good communication skills"
    ],
    skills: ["React", "TypeScript", "CSS", "HTML", "Git"],
    location: "San Francisco, CA",
    type: "Hybrid",
    duration: "3 months",
    stipend: "$4,000/month",
    postedAt: "2024-03-15",
    deadline: "2024-04-15",
    applicants: 45,
    status: "active",
    // createdAt: "2024-01-10T00:00:00Z",
    benefits: ["Mentorship", "Flexible hours", "Learning budget", "Team events"]
  },
  {
    id: "2",
    title: "UI/UX Design Intern",
    companyId: "2",
    companyName: "DesignCraft Studio",
    companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
    description: "Work alongside our design team to create beautiful and intuitive user experiences. You'll be involved in user research, wireframing, prototyping, and visual design for mobile and web applications.",
    requirements: [
      "Portfolio showcasing UI/UX design work",
      "Proficiency in Figma or similar design tools",
      "Understanding of design principles",
      "Experience with user research methods",
      "Strong attention to detail"
    ],
    skills: ["Figma", "User Research", "Prototyping", "Visual Design", "Wireframing"],
    location: "New York, NY",
    type: "On-site",
    duration: "4 months",
    stipend: "$3,500/month",
    postedAt: "2024-03-10",
    deadline: "2024-04-10",
    applicants: 32,
    status: "Open",
    benefits: ["Design software licenses", "Mentorship", "Portfolio reviews", "Industry exposure"]
  },
  {
    id: "3",
    title: "Full Stack Developer Intern",
    companyId: "3",
    companyName: "CloudTech Innovations",
    companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop",
    description: "Build scalable web applications using modern technologies. You'll work on both frontend and backend components, integrate APIs, and contribute to our cloud-native architecture.",
    requirements: [
      "Experience with JavaScript/TypeScript",
      "Knowledge of React and Node.js",
      "Understanding of databases (SQL/NoSQL)",
      "Familiarity with cloud platforms (AWS/Azure)",
      "Problem-solving mindset"
    ],
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker"],
    location: "Austin, TX",
    type: "Remote",
    duration: "6 months",
    stipend: "$5,000/month",
    postedAt: "2024-03-08",
    deadline: "2024-04-08",
    applicants: 67,
    status: "Open",
    benefits: ["Remote work", "Cloud certifications", "Tech allowance", "Performance bonus"]
  },
  {
    id: "4",
    title: "Backend Developer Intern",
    companyId: "4",
    companyName: "DataStream Corp",
    companyLogo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop",
    description: "Focus on server-side development and API design. You'll work with microservices architecture, implement data processing pipelines, and optimize database performance.",
    requirements: [
      "Strong programming skills in Java or Python",
      "Understanding of REST APIs",
      "Database design knowledge",
      "Experience with Linux/Unix systems",
      "Team collaboration skills"
    ],
    skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Microservices"],
    location: "Seattle, WA",
    type: "Hybrid",
    duration: "4 months",
    stipend: "$4,500/month",
    postedAt: "2024-03-12",
    deadline: "2024-04-12",
    applicants: 38,
    status: "Open",
    benefits: ["Tech talks", "Code reviews", "System design sessions", "Career guidance"]
  },
  {
    id: "5",
    title: "Data Science Intern",
    companyId: "5",
    companyName: "Analytics Pro",
    companyLogo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    description: "Apply machine learning and statistical analysis to solve real business problems. You'll work with large datasets, build predictive models, and create data visualizations.",
    requirements: [
      "Strong background in statistics and mathematics",
      "Proficiency in Python and R",
      "Experience with ML libraries (scikit-learn, pandas)",
      "Knowledge of data visualization tools",
      "Analytical thinking"
    ],
    skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
    location: "Boston, MA",
    type: "Remote",
    duration: "5 months",
    stipend: "$4,200/month",
    postedAt: "2024-03-14",
    deadline: "2024-04-14",
    applicants: 29,
    status: "Open",
    benefits: ["Dataset access", "ML courses", "Research publication opportunities", "Conference attendance"]
  }
];

export const companies = [
  {
    id: "1",
    name: "TechFlow Solutions",
    logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop",
    description: "Leading SaaS platform for business automation",
    website: "https://techflow.com",
    location: "San Francisco, CA"
  },
  {
    id: "2", 
    name: "DesignCraft Studio",
    logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=200&fit=crop",
    description: "Award-winning design agency specializing in digital experiences",
    website: "https://designcraft.com",
    location: "New York, NY"
  },
  {
    id: "3",
    name: "CloudTech Innovations",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=200&fit=crop",
    description: "Cloud-native solutions for enterprise clients",
    website: "https://cloudtech.com",
    location: "Austin, TX"
  },
  {
    id: "4",
    name: "DataStream Corp",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=200&h=200&fit=crop",
    description: "Big data analytics and processing solutions",
    website: "https://datastream.com",
    location: "Seattle, WA"
  },
  {
    id: "5",
    name: "Analytics Pro",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop",
    description: "Advanced analytics and machine learning consulting",
    website: "https://analyticspro.com",
    location: "Boston, MA"
  }
];