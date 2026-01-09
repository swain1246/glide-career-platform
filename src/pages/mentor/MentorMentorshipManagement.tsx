import React, { useState } from "react";
import { Search, Filter, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ActiveProgramCard } from "./mentorshipManagement/ActiveProgramCard";
import { UpcomingPrograms } from "./mentorshipManagement/UpcomingPrograms";
import { CompletedPrograms } from "./mentorshipManagement/CompletedPrograms";
import { MentorshipProgram, Student, Task, Update } from "./mentorshipManagement/types";

// Enhanced mock students data
const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alex Johnson",
    email: "alex@example.com",
    profileImage: null,
    education: [
      {
        institution: "University of Technology",
        degree: "B.S. Computer Science",
        year: 2023,
      },
      {
        institution: "Community College",
        degree: "A.S. Web Development",
        year: 2021,
      },
    ],
    experience: [
      {
        company: "Tech Startup",
        position: "Frontend Intern",
        duration: "3 months",
      },
      {
        company: "Freelance",
        position: "Web Developer",
        duration: "1 year",
      },
    ],
    skills: ["React", "JavaScript", "HTML", "CSS", "Node.js", "MongoDB", "Express", "Git", "TypeScript"],
    projects: [
      {
        name: "E-commerce Website",
        description: "A full-featured e-commerce website with payment integration, user authentication, and admin dashboard",
        technologies: ["React", "Node.js", "MongoDB", "Stripe API", "JWT"],
      },
      {
        name: "Social Media Dashboard",
        description: "A dashboard to manage multiple social media accounts with analytics",
        technologies: ["React", "Redux", "Chart.js", "Firebase"],
      },
    ],
  },
  {
    id: "s2",
    name: "Sam Smith",
    email: "sam@example.com",
    profileImage: null,
    education: [
      {
        institution: "State University",
        degree: "B.S. Information Technology",
        year: 2022,
      },
    ],
    experience: [
      {
        company: "Digital Agency",
        position: "Junior Developer",
        duration: "6 months",
      },
      {
        company: "Tech Corp",
        position: "Frontend Developer",
        duration: "8 months",
      },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Python", "Django", "PostgreSQL", "REST APIs", "Docker"],
    projects: [
      {
        name: "Task Management App",
        description: "A task management application with drag and drop functionality, real-time updates, and team collaboration features",
        technologies: ["React", "TypeScript", "Firebase", "Material UI"],
      },
      {
        name: "Weather Forecast App",
        description: "A weather application with location-based forecasts and interactive maps",
        technologies: ["React", "OpenWeather API", "Google Maps API"],
      },
    ],
  },
  {
    id: "s3",
    name: "Taylor Brown",
    email: "taylor@example.com",
    profileImage: null,
    education: [
      {
        institution: "Institute of Technology",
        degree: "M.S. Software Engineering",
        year: 2023,
      },
      {
        institution: "State University",
        degree: "B.S. Computer Science",
        year: 2021,
      },
    ],
    experience: [
      {
        company: "Software Company",
        position: "Backend Developer",
        duration: "1 year",
      },
      {
        company: "Cloud Solutions Inc",
        position: "Software Engineer",
        duration: "6 months",
      },
    ],
    skills: ["Java", "Spring Boot", "MySQL", "AWS", "Docker", "Kubernetes", "Microservices", "REST APIs", "Jenkins"],
    projects: [
      {
        name: "Microservices Architecture",
        description: "Implementation of microservices architecture for a large e-commerce platform with service discovery and load balancing",
        technologies: ["Java", "Spring Boot", "Docker", "Kubernetes", "Eureka", "Zuul"],
      },
      {
        name: "Data Processing Pipeline",
        description: "A real-time data processing pipeline for analytics and reporting",
        technologies: ["Java", "Apache Kafka", "Spring Cloud Stream", "Elasticsearch"],
      },
    ],
  },
  {
    id: "s4",
    name: "Jordan Lee",
    email: "jordan@example.com",
    profileImage: null,
    education: [
      {
        institution: "Tech University",
        degree: "B.S. Computer Engineering",
        year: 2022,
      },
    ],
    experience: [
      {
        company: "Startup Hub",
        position: "Full Stack Developer",
        duration: "10 months",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express", "GraphQL", "Apollo", "AWS"],
    projects: [
      {
        name: "Real-time Chat Application",
        description: "A real-time chat application with multiple rooms, file sharing, and message history",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB", "AWS S3"],
      },
    ],
  },
  {
    id: "s5",
    name: "Casey Davis",
    email: "casey@example.com",
    profileImage: null,
    education: [
      {
        institution: "University of Computing",
        degree: "B.S. Software Development",
        year: 2023,
      },
    ],
    experience: [
      {
        company: "Web Agency",
        position: "Frontend Developer Intern",
        duration: "4 months",
      },
    ],
    skills: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "SCSS", "Webpack", "Jest"],
    projects: [
      {
        name: "Portfolio Website",
        description: "A responsive portfolio website with animations and dark mode",
        technologies: ["React", "Framer Motion", "Styled Components"],
      },
    ],
  },
];

// Enhanced mock tasks data
const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Complete React tutorial",
    description: "Complete the advanced React tutorial and submit the project",
    dueDate: "2023-07-20",
    dueTime: "23:59",
    completed: true,
  },
  {
    id: "t2",
    title: "Build a portfolio project",
    description: "Build a portfolio project using React and Node.js with authentication and database integration",
    dueDate: "2023-08-01",
    dueTime: "23:59",
    completed: true,
  },
  {
    id: "t3",
    title: "Review session with mentor",
    description: "Attend the review session with the mentor to discuss progress and next steps",
    dueDate: "2023-07-25",
    dueTime: "15:00",
    completed: true,
  },
  {
    id: "t4",
    title: "Complete MongoDB course",
    description: "Finish the MongoDB course and complete all assignments",
    dueDate: "2023-07-30",
    dueTime: "23:59",
    completed: false,
  },
  {
    id: "t5",
    title: "Submit project proposal",
    description: "Submit a detailed proposal for your final project including tech stack and timeline",
    dueDate: "2023-08-05",
    dueTime: "23:59",
    completed: false,
  },
  {
    id: "t6",
    title: "Node.js API development",
    description: "Develop a RESTful API using Node.js and Express with proper error handling",
    dueDate: "2023-08-15",
    dueTime: "23:59",
    completed: false,
  },
  {
    id: "t7",
    title: "Authentication implementation",
    description: "Implement JWT-based authentication in your project with secure password handling",
    dueDate: "2023-08-20",
    dueTime: "23:59",
    completed: false,
  },
  {
    id: "t8",
    title: "Final project presentation",
    description: "Prepare and present your final project to the mentor and peers",
    dueDate: "2023-09-10",
    dueTime: "14:00",
    completed: false,
  },
];

// Enhanced mock updates data
const mockUpdates: Update[] = [
  {
    id: "u1",
    title: "Initial meeting scheduled",
    date: "2023-06-15",
    content: "We've scheduled our first meeting for next Monday at 3 PM. Please come prepared with your goals and expectations for this mentorship program.",
    forStudent: "All Students",
  },
  {
    id: "u2",
    title: "Learning resources shared",
    date: "2023-06-16",
    content: "I've shared some useful React tutorials and documentation for you to review. Focus on hooks and context API this week.",
    forStudent: "All Students",
  },
  {
    id: "u3",
    title: "Project feedback",
    date: "2023-06-20",
    content: "Great work on the first project! Here are some suggestions for improvement: 1) Add more error handling 2) Improve the responsive design 3) Add loading states",
    forStudent: "Alex Johnson",
  },
  {
    id: "u4",
    title: "Weekly progress check-in",
    date: "2023-06-22",
    content: "Don't forget our weekly progress check-in tomorrow. Be ready to share what you've learned and any challenges you're facing.",
    forStudent: "All Students",
  },
  {
    id: "u5",
    title: "New learning module",
    date: "2023-06-25",
    content: "I've added a new learning module on MongoDB. Please complete it by the end of this week and submit your assignment.",
    forStudent: "Sam Smith",
  },
  {
    id: "u6",
    title: "Code review session",
    date: "2023-06-28",
    content: "We'll have a code review session this Friday. Please have your current project code ready for review.",
    forStudent: "Taylor Brown",
  },
  {
    id: "u7",
    title: "Guest speaker announcement",
    date: "2023-07-01",
    content: "We'll have a guest speaker from a leading tech company next week to talk about industry best practices. Don't miss it!",
    forStudent: "All Students",
  },
  {
    id: "u8",
    title: "Project milestone",
    date: "2023-07-05",
    content: "Great progress on your projects! You've reached the first milestone. Next step is to implement the backend integration.",
    forStudent: "All Students",
  },
  {
    id: "u9",
    title: "Performance optimization tips",
    date: "2023-07-10",
    content: "I noticed some performance issues in your application. Here are some optimization techniques you should implement: code splitting, lazy loading, and memoization.",
    forStudent: "Jordan Lee",
  },
  {
    id: "u10",
    title: "Upcoming deadline reminder",
    date: "2023-07-15",
    content: "Just a reminder that your portfolio project is due in two weeks. Let me know if you need any help or extensions.",
    forStudent: "Casey Davis",
  },
];

// Mock data for active programs
const mockActivePrograms: MentorshipProgram[] = [
  {
    id: "p1",
    name: "Full Stack Development Bootcamp",
    type: "skill",
    domain: "Web Development",
    stack: "MERN Stack (MongoDB, Express, React, Node.js)",
    duration: "3 months",
    numberOfStudents: 5,
    startDate: "2023-06-15",
    endDate: "2023-09-15",
    status: "active",
    description: "A comprehensive program covering full stack development using MERN stack. Students will learn to build complete web applications from frontend to backend, including database design, API development, and deployment.",
    students: mockStudents,
    tasks: mockTasks,
    updates: mockUpdates,
  },
  {
    id: "p2",
    name: "Advanced React & Node.js",
    type: "skill",
    domain: "Web Development",
    stack: "React, Node.js, Express, MongoDB",
    duration: "2.5 months",
    numberOfStudents: 4,
    startDate: "2023-07-01",
    endDate: "2023-09-15",
    status: "active",
    description: "An advanced program focusing on complex React patterns, state management, and scalable Node.js backend development.",
    students: mockStudents.slice(0, 4),
    tasks: mockTasks.slice(0, 6),
    updates: mockUpdates.slice(0, 7),
  },
];

const mockUpcomingPrograms: MentorshipProgram[] = [
  {
    id: "p3",
    name: "Advanced React Patterns",
    type: "skill",
    domain: "Frontend Development",
    stack: "React, TypeScript, Redux",
    duration: "2 months",
    numberOfStudents: 5,
    startDate: "2023-09-20",
    endDate: "2023-11-20",
    status: "pending",
    description: "Deep dive into advanced React patterns and best practices including custom hooks, context optimization, and performance tuning.",
    students: [],
    tasks: [],
    updates: [],
  },
  {
    id: "p4",
    name: "Mobile App Development",
    type: "project",
    domain: "Mobile Development",
    stack: "React Native, Firebase",
    duration: "4 months",
    numberOfStudents: 4,
    startDate: "2023-10-01",
    endDate: "2024-02-01",
    status: "pending",
    description: "Build a complete mobile application using React Native and Firebase with real-time features and offline support.",
    students: [],
    tasks: [],
    updates: [],
  },
];

const mockCompletedPrograms: MentorshipProgram[] = [
  {
    id: "p5",
    name: "JavaScript Fundamentals",
    type: "skill",
    domain: "Web Development",
    stack: "JavaScript, HTML, CSS",
    duration: "1.5 months",
    numberOfStudents: 6,
    startDate: "2023-03-01",
    endDate: "2023-04-15",
    status: "completed",
    description: "A comprehensive program covering JavaScript fundamentals and modern web development techniques.",
    students: [],
    tasks: [],
    updates: [],
  },
  {
    id: "p6",
    name: "Frontend Development Basics",
    type: "skill",
    domain: "Frontend Development",
    stack: "HTML, CSS, JavaScript",
    duration: "2 months",
    numberOfStudents: 8,
    startDate: "2023-01-15",
    endDate: "2023-03-15",
    status: "completed",
    description: "Learn the fundamentals of frontend development including responsive design and modern CSS techniques.",
    students: [],
    tasks: [],
    updates: [],
  },
];

const MentorMentorshipManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Mentorship Management
              </h1>
              <p className="text-muted-foreground">
                Manage your mentorship programs, track progress, and support your students
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search programs..."
                  className="pl-10 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Programs</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Programs</TabsTrigger>
              <TabsTrigger value="completed">Completed Programs</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              {mockActivePrograms.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active programs</h3>
                    <p className="text-muted-foreground">Your active mentorship programs will appear here</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {mockActivePrograms.map((program) => (
                    <ActiveProgramCard key={program.id} program={program} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-4">
              <UpcomingPrograms programs={mockUpcomingPrograms} />
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <CompletedPrograms programs={mockCompletedPrograms} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default MentorMentorshipManagement;