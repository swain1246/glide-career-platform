export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  appliedAt: string;
  status: "pending" | "reviewing" | "interview" | "accepted" | "rejected";
  coverLetter: string;
  resumeUrl: string;
  skills: string[];
  notes?: string;
}

export const applications: Application[] = [
  {
    id: "1",
    jobId: "1",
    studentId: "1",
    studentName: "Alex Chen",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-16",
    status: "interview",
    coverLetter: "I'm excited to apply for the Frontend Developer Intern position at TechFlow Solutions. My experience with React and TypeScript, combined with my passion for creating intuitive user interfaces, makes me a perfect fit for this role. I've built several projects including EcoTrack, a carbon footprint tracking app that demonstrates my ability to combine frontend development with meaningful impact.",
    resumeUrl: "/resumes/alex-chen.pdf",
    skills: ["React", "TypeScript", "CSS", "HTML", "Git"],
    notes: "Strong technical background, good project portfolio"
  },
  {
    id: "2",
    jobId: "2",
    studentId: "2", 
    studentName: "Sarah Williams",
    studentAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612c9ba?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-15",
    status: "reviewing",
    coverLetter: "As a design-focused developer with a strong portfolio in UI/UX design, I'm thrilled to apply for the UI/UX Design Intern position. My experience with Figma and user research, showcased in projects like HealthDash, demonstrates my ability to create beautiful and functional user experiences.",
    resumeUrl: "/resumes/sarah-williams.pdf",
    skills: ["Figma", "User Research", "Prototyping", "Visual Design"],
    notes: "Excellent design portfolio, good understanding of user-centered design"
  },
  {
    id: "3",
    jobId: "3",
    studentId: "1",
    studentName: "Alex Chen", 
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-14",
    status: "accepted",
    coverLetter: "I'm applying for the Full Stack Developer Intern position because I believe my comprehensive experience with both frontend and backend technologies makes me an ideal candidate. My work on StudyBuddy demonstrates my ability to build full-stack applications with modern technologies.",
    resumeUrl: "/resumes/alex-chen.pdf",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    notes: "Accepted - Strong full-stack experience, good cultural fit"
  },
  {
    id: "4",
    jobId: "4",
    studentId: "3",
    studentName: "Raj Patel",
    studentAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-13",
    status: "pending",
    coverLetter: "I'm excited to apply for the Backend Developer Intern position. My strong background in Java and Spring Boot, along with my experience building microservices architecture in TaskFlow, aligns perfectly with your requirements for scalable backend systems.",
    resumeUrl: "/resumes/raj-patel.pdf",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
    notes: "Good technical skills, pending review"
  },
  {
    id: "5",
    jobId: "5",
    studentId: "4",
    studentName: "Emily Johnson",
    studentAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-17",
    status: "reviewing",
    coverLetter: "As a data science enthusiast with hands-on experience in machine learning and statistical analysis, I'm thrilled to apply for the Data Science Intern position. My project PredictStock showcases my ability to apply ML techniques to real-world problems and deliver actionable insights.",
    resumeUrl: "/resumes/emily-johnson.pdf",
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    notes: "Strong analytical background, good project demonstration"
  },
  {
    id: "6",
    jobId: "1",
    studentId: "2",
    studentName: "Sarah Williams",
    studentAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612c9ba?w=400&h=400&fit=crop&crop=face",
    appliedAt: "2024-03-12",
    status: "rejected",
    coverLetter: "I'm interested in the Frontend Developer Intern position as it combines my design background with development skills. I believe my understanding of user experience can bring a unique perspective to your frontend team.",
    resumeUrl: "/resumes/sarah-williams.pdf",
    skills: ["React", "CSS", "Figma"],
    notes: "Good design skills but limited frontend development experience"
  }
];

export interface JobAnalytics {
  jobId: string;
  totalApplications: number;
  statusBreakdown: {
    pending: number;
    reviewing: number;
    interview: number;
    accepted: number;
    rejected: number;
  };
  topSkills: Array<{
    skill: string;
    count: number;
  }>;
  applicationTrend: Array<{
    date: string;
    applications: number;
  }>;
}

export const jobAnalytics: JobAnalytics[] = [
  {
    jobId: "1",
    totalApplications: 45,
    statusBreakdown: {
      pending: 15,
      reviewing: 12,
      interview: 8,
      accepted: 3,
      rejected: 7
    },
    topSkills: [
      { skill: "React", count: 38 },
      { skill: "TypeScript", count: 28 },
      { skill: "CSS", count: 35 },
      { skill: "Git", count: 42 }
    ],
    applicationTrend: [
      { date: "2024-03-15", applications: 8 },
      { date: "2024-03-16", applications: 12 },
      { date: "2024-03-17", applications: 15 },
      { date: "2024-03-18", applications: 10 }
    ]
  },
  {
    jobId: "2", 
    totalApplications: 32,
    statusBreakdown: {
      pending: 10,
      reviewing: 8,
      interview: 6,
      accepted: 2,
      rejected: 6
    },
    topSkills: [
      { skill: "Figma", count: 30 },
      { skill: "User Research", count: 25 },
      { skill: "Prototyping", count: 28 },
      { skill: "Visual Design", count: 20 }
    ],
    applicationTrend: [
      { date: "2024-03-10", applications: 5 },
      { date: "2024-03-11", applications: 8 },
      { date: "2024-03-12", applications: 12 },
      { date: "2024-03-13", applications: 7 }
    ]
  }
];