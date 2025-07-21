export interface Notification {
  id: string;
  userId: string;
  type: "application" | "interview" | "mentor_invite" | "job_match" | "system" | "job_application";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    jobId?: string;
    mentorId?: string;
    applicationId?: string;
  };
}

export const notifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "interview",
    title: "Interview Scheduled",
    message: "Your interview for Frontend Developer Intern at TechFlow Solutions has been scheduled for March 20th at 2:00 PM.",
    isRead: false,
    createdAt: "2024-03-18T10:30:00Z",
    actionUrl: "/student/applications",
    metadata: {
      jobId: "1",
      applicationId: "1"
    }
  },
  {
    id: "2",
    userId: "1", 
    type: "mentor_invite",
    title: "New Mentor Invitation",
    message: "Michael Rodriguez (Senior Software Engineer at Google) has invited you for mentorship in System Design.",
    isRead: false,
    createdAt: "2024-03-17T14:15:00Z",
    actionUrl: "/student/mentors",
    metadata: {
      mentorId: "1"
    }
  },
  {
    id: "3",
    userId: "2",
    type: "application",
    title: "Application Update",
    message: "Your application for UI/UX Design Intern at DesignCraft Studio is now under review.",
    isRead: true,
    createdAt: "2024-03-16T09:20:00Z",
    actionUrl: "/student/applications",
    metadata: {
      jobId: "2",
      applicationId: "2"
    }
  },
  {
    id: "4",
    userId: "1",
    type: "job_match",
    title: "New Job Match",
    message: "A new Full Stack Developer position matches your skills. Check it out!",
    isRead: true,
    createdAt: "2024-03-15T16:45:00Z",
    actionUrl: "/jobs/3",
    metadata: {
      jobId: "3"
    }
  },
  {
    id: "5",
    userId: "3",
    type: "application",
    title: "Application Received",
    message: "Your application for Backend Developer Intern has been received and is being reviewed.",
    isRead: false,
    createdAt: "2024-03-13T11:30:00Z",
    actionUrl: "/student/applications",
    metadata: {
      jobId: "4",
      applicationId: "4"
    }
  },
  {
    id: "6",
    userId: "4",
    type: "mentor_invite",
    title: "Mentor Invitation Accepted",
    message: "David Kim has accepted your mentorship request. You can now schedule your first session.",
    isRead: false,
    createdAt: "2024-03-17T12:00:00Z",
    actionUrl: "/student/mentors",
    metadata: {
      mentorId: "3"
    }
  },
  {
    id: "7", 
    userId: "2",
    type: "system",
    title: "Profile Verification Complete",
    message: "Your student profile has been verified. You can now apply to all available positions.",
    isRead: true,
    createdAt: "2024-03-10T08:00:00Z",
    actionUrl: "/student/profile"
  }
];

// Company notifications
export const companyNotifications: Notification[] = [
  {
    id: "c1",
    userId: "company1",
    type: "application",
    title: "New Application Received",
    message: "Alex Chen has applied for the Frontend Developer Intern position.",
    isRead: false,
    createdAt: "2024-03-16T15:30:00Z",
    actionUrl: "/company/applicants/1",
    metadata: {
      jobId: "1",
      applicationId: "1"
    }
  },
  {
    id: "c2",
    userId: "company1",
    type: "application",
    title: "Application Update Required",
    message: "Sarah Williams' application is awaiting review for the Frontend Developer position.",
    isRead: true,
    createdAt: "2024-03-12T10:15:00Z",
    actionUrl: "/company/applicants/1",
    metadata: {
      jobId: "1",
      applicationId: "6"
    }
  }
];

// Mentor notifications
export const mentorNotifications: Notification[] = [
  {
    id: "m1",
    userId: "mentor1",
    type: "mentor_invite",
    title: "Mentorship Response",
    message: "Sarah Williams has accepted your mentorship invitation.",
    isRead: false,
    createdAt: "2024-03-15T13:20:00Z",
    actionUrl: "/mentor/students",
    metadata: {
      mentorId: "2"
    }
  },
  {
    id: "m2",
    userId: "mentor3",
    type: "mentor_invite",
    title: "New Mentorship Request",
    message: "Emily Johnson is interested in your Machine Learning mentorship.",
    isRead: false,
    createdAt: "2024-03-17T16:45:00Z",
    actionUrl: "/mentor/requests",
    metadata: {
      mentorId: "3"
    }
  }
];