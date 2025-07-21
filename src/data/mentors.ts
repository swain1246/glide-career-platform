export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
  skills: string[];
  experience: string;
  linkedinUrl?: string;
  rating: number;
  totalSessions: number;
  availability: Array<{
    day: string;
    slots: string[];
  }>;
  price: string;
  specialties: string[];
}

export const mentors: Mentor[] = [
  {
    id: "1",
    name: "Michael Rodriguez",
    title: "Senior Software Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    bio: "10+ years of experience in full-stack development. Passionate about mentoring the next generation of developers and helping them navigate their career paths.",
    skills: ["JavaScript", "React", "Node.js", "System Design", "Career Guidance"],
    experience: "10 years",
    linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
    rating: 4.9,
    totalSessions: 150,
    availability: [
      {
        day: "Monday",
        slots: ["6:00 PM", "7:00 PM", "8:00 PM"]
      },
      {
        day: "Wednesday", 
        slots: ["6:00 PM", "7:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["10:00 AM", "11:00 AM", "2:00 PM"]
      }
    ],
    price: "$75/hour",
    specialties: ["Code Reviews", "System Design", "Interview Prep", "Career Planning"]
  },
  {
    id: "2",
    name: "Lisa Chen",
    title: "Principal UX Designer",
    company: "Apple",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    bio: "Leading design teams for consumer products used by millions. Expert in user research, design systems, and product strategy.",
    skills: ["UI/UX Design", "Design Systems", "User Research", "Prototyping", "Product Strategy"],
    experience: "12 years",
    linkedinUrl: "https://linkedin.com/in/lisachen-design",
    rating: 4.8,
    totalSessions: 95,
    availability: [
      {
        day: "Tuesday",
        slots: ["7:00 PM", "8:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["6:30 PM", "7:30 PM"]
      },
      {
        day: "Sunday",
        slots: ["11:00 AM", "1:00 PM"]
      }
    ],
    price: "$85/hour",
    specialties: ["Portfolio Reviews", "Design Critique", "Career Transition", "Leadership"]
  },
  {
    id: "3",
    name: "David Kim",
    title: "Data Science Manager",
    company: "Meta",
    avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
    bio: "Leading data science initiatives in social media analytics. Passionate about machine learning applications and data-driven decision making.",
    skills: ["Machine Learning", "Python", "Statistical Analysis", "Data Visualization", "Team Leadership"],
    experience: "8 years",
    linkedinUrl: "https://linkedin.com/in/davidkim-ds",
    rating: 4.7,
    totalSessions: 75,
    availability: [
      {
        day: "Wednesday",
        slots: ["7:00 PM", "8:00 PM"]
      },
      {
        day: "Friday",
        slots: ["6:00 PM", "7:00 PM"]
      },
      {
        day: "Saturday",
        slots: ["9:00 AM", "10:00 AM"]
      }
    ],
    price: "$90/hour",
    specialties: ["ML Model Design", "Data Strategy", "Research Methodology", "Technical Leadership"]
  },
  {
    id: "4",
    name: "Sarah Thompson",
    title: "Product Manager",
    company: "Microsoft",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    bio: "Product management expert with experience launching enterprise and consumer products. Focus on product strategy and go-to-market planning.",
    skills: ["Product Management", "Strategy", "Market Research", "Analytics", "Leadership"],
    experience: "9 years",
    linkedinUrl: "https://linkedin.com/in/sarahthompson-pm",
    rating: 4.8,
    totalSessions: 120,
    availability: [
      {
        day: "Monday",
        slots: ["7:00 PM", "8:00 PM"]
      },
      {
        day: "Thursday",
        slots: ["6:00 PM", "7:00 PM", "8:00 PM"]
      },
      {
        day: "Sunday",
        slots: ["10:00 AM", "2:00 PM"]
      }
    ],
    price: "$80/hour",
    specialties: ["Product Strategy", "Market Analysis", "Product-Market Fit", "Stakeholder Management"]
  }
];

export interface MentorInvite {
  id: string;
  mentorId: string;
  studentId: string;
  status: "pending" | "accepted" | "declined";
  message: string;
  sentAt: string;
  skills: string[];
}

export const mentorInvites: MentorInvite[] = [
  {
    id: "1",
    mentorId: "1",
    studentId: "1",
    status: "pending",
    message: "Hi Alex! I noticed your work on machine learning projects and would love to help you with system design and backend architecture. Let's connect!",
    sentAt: "2024-03-16",
    skills: ["System Design", "Backend Development"]
  },
  {
    id: "2",
    mentorId: "2",
    studentId: "2",
    status: "accepted",
    message: "Sarah, your design portfolio is impressive! I'd be happy to provide feedback and help you transition into product design roles.",
    sentAt: "2024-03-14",
    skills: ["UI/UX Design", "Portfolio Review"]
  },
  {
    id: "3",
    mentorId: "3",
    studentId: "4",
    status: "pending",
    message: "Emily, your data science projects show great potential. I can help you scale your ML models and break into the industry.",
    sentAt: "2024-03-17",
    skills: ["Machine Learning", "Career Guidance"]
  }
];