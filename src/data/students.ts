export interface Student {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
  skills: string[];
  bio: string;
  avatar: string;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  applications: string[]; // job IDs
  mentorInvites: string[]; // mentor IDs
  isVerified: boolean;
  joinedAt: string;
}

export const students: Student[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex.chen@university.edu",
    college: "Stanford University",
    year: "Final Year",
    skills: ["React", "Node.js", "Python", "Machine Learning", "TypeScript"],
    bio: "Passionate full-stack developer with a strong interest in AI/ML. Currently working on a recommendation system for e-commerce platforms.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    resumeUrl: "/resumes/alex-chen.pdf",
    githubUrl: "https://github.com/alexchen",
    linkedinUrl: "https://linkedin.com/in/alexchen",
    portfolioUrl: "https://alexchen.dev",
    projects: [
      {
        name: "EcoTrack",
        description: "Carbon footprint tracking app with ML-powered suggestions",
        technologies: ["React Native", "Python", "TensorFlow", "Firebase"],
        githubUrl: "https://github.com/alexchen/ecotrack",
        liveUrl: "https://ecotrack.app"
      },
      {
        name: "StudyBuddy",
        description: "Collaborative study platform for university students",
        technologies: ["Next.js", "Prisma", "WebSocket", "Tailwind CSS"],
        githubUrl: "https://github.com/alexchen/studybuddy"
      }
    ],
    applications: ["1", "3"],
    mentorInvites: ["1"],
    isVerified: true,
    joinedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah.w@mit.edu",
    college: "MIT",
    year: "Third Year",
    skills: ["UI/UX Design", "Figma", "React", "CSS", "User Research"],
    bio: "Design-focused developer passionate about creating intuitive user experiences. Love combining aesthetics with functionality.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c9ba?w=400&h=400&fit=crop&crop=face",
    resumeUrl: "/resumes/sarah-williams.pdf",
    githubUrl: "https://github.com/sarahw",
    linkedinUrl: "https://linkedin.com/in/sarahwilliams",
    portfolioUrl: "https://sarahwdesign.com",
    projects: [
      {
        name: "HealthDash",
        description: "Health monitoring dashboard with beautiful data visualization",
        technologies: ["React", "D3.js", "Chart.js", "Tailwind CSS"],
        githubUrl: "https://github.com/sarahw/healthdash",
        liveUrl: "https://healthdash.dev"
      }
    ],
    applications: ["2"],
    mentorInvites: ["2"],
    isVerified: true,
    joinedAt: "2024-02-01"
  },
  {
    id: "3",
    name: "Raj Patel",
    email: "raj.patel@berkeley.edu",
    college: "UC Berkeley",
    year: "Second Year",
    skills: ["Java", "Spring Boot", "Microservices", "Docker", "AWS"],
    bio: "Backend enthusiast focused on building scalable systems. Interested in cloud architecture and distributed systems.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    resumeUrl: "/resumes/raj-patel.pdf",
    githubUrl: "https://github.com/rajpatel",
    linkedinUrl: "https://linkedin.com/in/rajpatel",
    projects: [
      {
        name: "TaskFlow",
        description: "Microservices-based task management system",
        technologies: ["Java", "Spring Boot", "Redis", "PostgreSQL", "Docker"],
        githubUrl: "https://github.com/rajpatel/taskflow"
      }
    ],
    applications: ["4"],
    mentorInvites: [],
    isVerified: true,
    joinedAt: "2024-02-20"
  },
  {
    id: "4",
    name: "Emily Johnson",
    email: "emily.j@caltech.edu",
    college: "Caltech",
    year: "Final Year",
    skills: ["Data Science", "Python", "R", "SQL", "Tableau", "Machine Learning"],
    bio: "Data science enthusiast with experience in predictive modeling and statistical analysis. Passionate about turning data into insights.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    resumeUrl: "/resumes/emily-johnson.pdf",
    githubUrl: "https://github.com/emilyj",
    linkedinUrl: "https://linkedin.com/in/emilyjohnson",
    projects: [
      {
        name: "PredictStock",
        description: "Stock price prediction using machine learning models",
        technologies: ["Python", "Scikit-learn", "Pandas", "Flask", "Plotly"],
        githubUrl: "https://github.com/emilyj/predictstock"
      }
    ],
    applications: ["5"],
    mentorInvites: ["3"],
    isVerified: true,
    joinedAt: "2024-01-30"
  }
];