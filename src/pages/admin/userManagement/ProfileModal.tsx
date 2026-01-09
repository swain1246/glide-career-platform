import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Download,
  X,
} from "lucide-react";

// Types for student profile
interface StudentEducation {
  id: string;
  qualification: string;
  institution: string;
  examinationBoard?: string;
  passingYear?: string;
  courseName?: string;
  specialization?: string;
  startYear?: string;
  endYear?: string;
  percentage: string;
}

interface StudentCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  certificateId?: string;
  issueDate: string;
  certificateUrl?: string;
}

interface StudentInternship {
  id: string;
  companyName: string;
  role: string;
  duration: string;
  projectName: string;
  skills: string[];
  projectUrl?: string;
  description: string;
}

interface StudentProject {
  id: string;
  name: string;
  duration: string;
  description: string;
  skills: string[];
  projectUrl?: string;
}

interface StudentProfile {
  id: string;
  name: string;
  profileImage: string;
  collegeName: string;
  courseName: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  education: StudentEducation[];
  certifications: StudentCertification[];
  internships: StudentInternship[];
  projects: StudentProject[];
  skills: string[];
  resume: {
    fileName: string;
    uploadDate: string;
    url: string;
  };
}

// Types for mentor profile
interface MentorExperience {
  id: string;
  companyName: string;
  designation: string;
  type: string;
  joiningDate: string;
  yearsOfExperience: number;
  skills: string[];
  description: string;
}

interface MentorProfile {
  id: string;
  name: string;
  profileImage: string;
  companyName: string;
  designation: string;
  gender: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  education: StudentEducation[];
  experience: MentorExperience[];
  skills: string[];
}

// Mock student data
const mockStudentProfile: StudentProfile = {
  id: "1",
  name: "Sarah Johnson",
  profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
  collegeName: "Stanford University",
  courseName: "Computer Science",
  gender: "Female",
  dateOfBirth: "January 15, 2000",
  email: "sarah.j@example.com",
  phone: "+1 (555) 123-4567",
  location: "Stanford, CA",
  bio: "Passionate computer science student with a focus on artificial intelligence and machine learning. Eager to apply my skills to real-world problems and contribute to innovative projects.",
  education: [
    {
      id: "1",
      qualification: "XII (12th Grade)",
      institution: "Lincoln High School",
      examinationBoard: "State Board",
      passingYear: "2018",
      percentage: "92%",
    },
    {
      id: "2",
      qualification: "B.Tech",
      institution: "Stanford University",
      courseName: "Computer Science",
      specialization: "Artificial Intelligence",
      startYear: "2018",
      endYear: "2022",
      percentage: "85%",
    },
  ],
  certifications: [
    {
      id: "1",
      name: "AWS Certified Developer",
      issuingOrganization: "Amazon Web Services",
      certificateId: "AWS-DEV-2021",
      issueDate: "June 15, 2021",
      certificateUrl: "https://example.com/cert1",
    },
    {
      id: "2",
      name: "Google Data Analytics Certificate",
      issuingOrganization: "Google",
      issueDate: "March 10, 2022",
      certificateUrl: "https://example.com/cert2",
    },
  ],
  internships: [
    {
      id: "1",
      companyName: "Tech Innovations Inc.",
      role: "Software Engineering Intern",
      duration: "3 months",
      projectName: "AI-Powered Recommendation System",
      skills: ["Python", "Machine Learning", "TensorFlow"],
      projectUrl: "https://example.com/project1",
      description: "Developed a recommendation system using collaborative filtering and content-based methods.",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Smart Campus Navigation",
      duration: "4 months",
      description: "A mobile application that helps students navigate the campus using AR technology.",
      skills: ["React Native", "Firebase", "AR.js"],
      projectUrl: "https://example.com/project2",
    },
  ],
  skills: ["Python", "Java", "JavaScript", "React", "Machine Learning", "Data Analysis"],
  resume: {
    fileName: "Sarah_Johnson_Resume.pdf",
    uploadDate: "May 1, 2022",
    url: "https://example.com/resume1",
  },
};

// Mock mentor data
const mockMentorProfile: MentorProfile = {
  id: "2",
  name: "Michael Chen",
  profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
  companyName: "Tech Innovations Inc.",
  designation: "Senior Software Engineer",
  gender: "Male",
  dateOfBirth: "August 22, 1985",
  email: "michael.c@example.com",
  phone: "+1 (555) 987-6543",
  location: "San Francisco, CA",
  bio: "Experienced software engineer with over 10 years of experience in full-stack development and team leadership. Passionate about mentoring the next generation of developers.",
  education: [
    {
      id: "1",
      qualification: "B.S.",
      institution: "MIT",
      courseName: "Computer Science",
      specialization: "Software Engineering",
      startYear: "2003",
      endYear: "2007",
      percentage: "90%",
    },
    {
      id: "2",
      qualification: "M.S.",
      institution: "Stanford University",
      courseName: "Computer Science",
      specialization: "Artificial Intelligence",
      startYear: "2007",
      endYear: "2009",
      percentage: "88%",
    },
  ],
  experience: [
    {
      id: "1",
      companyName: "Tech Innovations Inc.",
      designation: "Senior Software Engineer",
      type: "Full-time",
      joiningDate: "January 2015",
      yearsOfExperience: 8,
      skills: ["Java", "Spring", "React", "AWS", "Team Leadership"],
      description: "Leading a team of 5 developers in building scalable web applications.",
    },
    {
      id: "2",
      companyName: "Global Solutions Ltd.",
      designation: "Software Engineer",
      type: "Full-time",
      joiningDate: "June 2009",
      yearsOfExperience: 6,
      skills: ["C#", ".NET", "SQL Server", "JavaScript"],
      description: "Developed and maintained enterprise-level applications for various clients.",
    },
  ],
  skills: ["Java", "Spring", "React", "AWS", "Python", "Team Leadership", "Project Management"],
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const [userType, setUserType] = useState<"student" | "mentor">("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch user data based on userId
    // For now, we'll determine user type based on userId
    if (userId === "1") {
      setUserType("student");
    } else if (userId === "2") {
      setUserType("mentor");
    }
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 md:p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b p-4 md:p-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">User Profile</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        {/* Profile Content */}
        <div className="p-4 md:p-6">
          {userType === "student" ? (
            <StudentProfileComponent profile={mockStudentProfile} />
          ) : (
            <MentorProfileComponent profile={mockMentorProfile} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Student Profile Component
const StudentProfileComponent: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Profile Hero Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage src={profile.profileImage} alt={profile.name} />
              <AvatarFallback className="text-xl md:text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-base md:text-lg">{profile.collegeName}</span>
            </div>
            <p className="text-muted-foreground mt-1">{profile.courseName}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium">{profile.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">{profile.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{profile.location}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Bio</p>
              <p className="text-sm text-foreground">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
          <TabsTrigger value="certifications" className="text-xs">Certifications</TabsTrigger>
          <TabsTrigger value="internships" className="text-xs">Internships</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="resume" className="text-xs">Resume</TabsTrigger>
        </TabsList>
        
        <TabsContent value="education" className="mt-4">
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div key={edu.id} className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{edu.qualification}</h3>
                    <p className="text-muted-foreground text-sm">{edu.institution}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">{edu.percentage}</Badge>
                      {edu.examinationBoard && (
                        <Badge variant="outline" className="text-xs">{edu.examinationBoard}</Badge>
                      )}
                      {edu.passingYear && (
                        <Badge variant="outline" className="text-xs">{edu.passingYear}</Badge>
                      )}
                      {edu.courseName && (
                        <Badge variant="outline" className="text-xs">{edu.courseName}</Badge>
                      )}
                      {edu.specialization && (
                        <Badge variant="outline" className="text-xs">{edu.specialization}</Badge>
                      )}
                      {edu.startYear && edu.endYear && (
                        <Badge variant="outline" className="text-xs">{edu.startYear} - {edu.endYear}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-4">
          <div className="space-y-3">
            {profile.certifications.map((cert) => (
              <div key={cert.id} className="bg-card rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{cert.name}</h3>
                    <p className="text-muted-foreground text-sm">{cert.issuingOrganization}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">{cert.issueDate}</Badge>
                      {cert.certificateId && (
                        <Badge variant="outline" className="text-xs">{cert.certificateId}</Badge>
                      )}
                    </div>
                  </div>
                  {cert.certificateUrl && (
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="internships" className="mt-4">
          <div className="space-y-3">
            {profile.internships.map((internship) => (
              <div key={internship.id} className="bg-card rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{internship.role}</h3>
                    <p className="text-muted-foreground text-sm">{internship.companyName}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">{internship.duration}</Badge>
                      <Badge variant="outline" className="text-xs">{internship.projectName}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {internship.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs">{internship.description}</p>
                  </div>
                  {internship.projectUrl && (
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="mt-4">
          <div className="space-y-3">
            {profile.projects.map((project) => (
              <div key={project.id} className="bg-card rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{project.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">{project.duration}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs">{project.description}</p>
                  </div>
                  {project.projectUrl && (
                    <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
                      View
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="resume" className="mt-4">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <h3 className="font-semibold text-sm">{profile.resume.fileName}</h3>
                <p className="text-xs text-muted-foreground">Uploaded on {profile.resume.uploadDate}</p>
              </div>
              <Button size="sm" className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Mentor Profile Component
const MentorProfileComponent: React.FC<{ profile: MentorProfile }> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Profile Hero Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              <AvatarImage src={profile.profileImage} alt={profile.name} />
              <AvatarFallback className="text-xl md:text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl md:text-2xl font-bold">{profile.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-base md:text-lg">{profile.companyName}</span>
            </div>
            <p className="text-muted-foreground mt-1">{profile.designation}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium">{profile.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">{profile.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{profile.location}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Bio</p>
              <p className="text-sm text-foreground">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="education" className="mt-4">
          <div className="space-y-3">
            {profile.education.map((edu) => (
              <div key={edu.id} className="bg-card rounded-lg border p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm">{edu.qualification}</h3>
                    <p className="text-muted-foreground text-sm">{edu.institution}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">{edu.percentage}</Badge>
                      {edu.examinationBoard && (
                        <Badge variant="outline" className="text-xs">{edu.examinationBoard}</Badge>
                      )}
                      {edu.passingYear && (
                        <Badge variant="outline" className="text-xs">{edu.passingYear}</Badge>
                      )}
                      {edu.courseName && (
                        <Badge variant="outline" className="text-xs">{edu.courseName}</Badge>
                      )}
                      {edu.specialization && (
                        <Badge variant="outline" className="text-xs">{edu.specialization}</Badge>
                      )}
                      {edu.startYear && edu.endYear && (
                        <Badge variant="outline" className="text-xs">{edu.startYear} - {edu.endYear}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="experience" className="mt-4">
          <div className="space-y-3">
            {profile.experience.map((exp) => (
              <div key={exp.id} className="bg-card rounded-lg border p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-sm">{exp.designation}</h3>
                    <p className="text-muted-foreground text-sm">{exp.companyName}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">{exp.type}</Badge>
                      <Badge variant="outline" className="text-xs">{exp.joiningDate}</Badge>
                      <Badge variant="outline" className="text-xs">{exp.yearsOfExperience} years</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="skills" className="mt-4">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileModal;