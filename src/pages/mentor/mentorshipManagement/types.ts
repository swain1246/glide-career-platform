export interface Student {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  education: {
    institution: string;
    degree: string;
    year: number;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
  }[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
  }[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
}

export interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
  forStudent: string;
}

export interface MentorshipProgram {
  id: string;
  name: string;
  type: string;
  domain: string;
  stack: string;
  duration: string;
  numberOfStudents: number;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  students: Student[];
  tasks: Task[];
  updates: Update[];
}