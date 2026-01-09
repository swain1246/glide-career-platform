import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Award,
  X,
  Calendar,
  User,
  Building,
  Hash,
  GraduationCap,
  ChevronDown,
  School,
  University,
  Award as AwardIcon,
  Briefcase,
  Link,
  ExternalLink,
  FolderOpen,
  Code,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ViewStudentProfileDetails } from "@/api/admin/MentorshipRequest";
import { GetProfileImage } from "@/api/userServices";

// Interfaces remain the same
interface Education {
  level: "X" | "XII" | "Diploma" | "Bachelor" | "Master" | "PhD";
  schoolName?: string;
  instituteName?: string;
  examinationBoard?: string;
  mediumOfStudy?: string;
  passingYear?: string;
  percentage?: string;
  courseName?: string;
  specialization?: string;
  cgpa?: string;
  startDate?: string;
  endDate?: string;
}

interface Internship {
  companyName: string;
  role: string;
  duration: string;
  projectName?: string;
  skills?: string[];
  projectUrl?: string;
  description?: string;
}

interface Project {
  projectName: string;
  duration: string;
  description: string;
  skills: string[];
  projectUrl?: string;
}

interface Certification {
  certificationName: string;
  issuingOrganization: string;
  certificateId?: string;
  issueDate?: string;
  certificateUrl?: string;
}

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  education?: string;
  college?: string;
  registrationNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  skills?: string[];
  bio?: string;
  avatar?: string;
  educations?: Education[];
  internships?: Internship[];
  projects?: Project[];
  certifications?: Certification[];
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number | null;
}

// Skeleton Components
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`}></div>
);

const SkeletonProfileHeader = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 md:w-2/5">
          <div className="h-24 w-24 mb-4 rounded-full bg-gray-200"></div>
          <div className="flex flex-col items-center text-center space-y-2 w-full">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        
        {/* Profile Details Section */}
        <div className="p-4 md:w-3/5">
          <div className="grid grid-cols-1 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start">
                  <div className="h-4 w-4 bg-gray-300 mr-2 mt-0.5 flex-shrink-0 rounded-full"></div>
                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const SkeletonSection = ({ title, lines = 1 }: { title: string; lines?: number }) => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  </div>
);

const SkeletonEducationSection = () => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-l-4 border-l-gray-300">
          <div className="p-3">
            <div className="flex items-center mb-2">
              <div className="h-5 w-5 bg-gray-300 mr-3 rounded"></div>
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="p-2 bg-gray-50">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 mr-2 rounded"></div>
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SkeletonCardSection = ({ title, count = 2 }: { title: string; count?: number }) => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-l-4 border-l-gray-300">
          <div className="p-3">
            <div className="flex items-center mb-2">
              <div className="h-5 w-5 bg-gray-300 mr-3 rounded"></div>
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="p-2 bg-gray-50">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 mr-2 rounded"></div>
                    <div>
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SkeletonProjectSection = () => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="overflow-hidden border-l-4 border-l-gray-300 shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-gray-300 mr-1 rounded"></div>
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <div>
                <div className="flex items-center mb-2">
                  <div className="h-4 w-4 bg-gray-300 mr-1 rounded"></div>
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex flex-wrap gap-1">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SkeletonCertificationSection = () => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-32" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="shadow-sm border-l-4 border-l-gray-300">
          <div className="p-4">
            <div className="flex items-start mb-3">
              <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-4 w-40 mb-3" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const SkeletonSkillsSection = () => (
  <div>
    <div className="flex items-center mb-3">
      <div className="h-5 w-5 bg-gray-300 mr-2 rounded"></div>
      <Skeleton className="h-5 w-16" />
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  studentId,
}) => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!studentId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await ViewStudentProfileDetails(studentId);
        const data = JSON.parse(response.data);
        
        // Transform API data to our StudentProfile interface
        const profileData: StudentProfile = {
          id: data.StudentsProfileHero[0].UserId.toString(),
          name: data.StudentsProfileHero[0].StudentName,
          email: data.StudentsProfileHero[0].Email,
          phone: data.StudentsProfileHero[0].PhoneNo,
          location: data.StudentsProfileHero[0].CurrentLocation,
          education: data.StudentsProfileHero[0].Degree,
          college: data.StudentsProfileHero[0].College,
          registrationNumber: data.StudentsProfileHero[0].RegistrationNo,
          gender: data.StudentsProfileHero[0].Gender,
          dateOfBirth: data.StudentsProfileHero[0].Dob,
          bio: data.StudentsProfileHero[0].ProfileSummary,
          avatar: data.StudentsProfileHero[0].ProfileImagePath,
          skills: data.StudentSkills[0].Skills.split(',').map(skill => skill.trim()),
          educations: data.StudentEducation.map((edu: any) => {
            // Determine education level
            let level: Education["level"] = "Bachelor";
            if (edu.Qualification.includes("X (10th Grade)")) level = "X";
            else if (edu.Qualification.includes("XII (12th Grade)")) level = "XII";
            else if (edu.Qualification.includes("Bachelor")) level = "Bachelor";
            else if (edu.Qualification.includes("Master")) level = "Master";
            else if (edu.Qualification.includes("PhD")) level = "PhD";
            else if (edu.Qualification.includes("Diploma")) level = "Diploma";
            
            // Create education object based on level
            if (level === "X" || level === "XII") {
              return {
                level,
                schoolName: edu.CollegeName || "N/A",
                examinationBoard: edu.ExaminationBoard || "N/A",
                mediumOfStudy: edu.MediumOfStudy || "N/A",
                passingYear: edu.PassingYear ? edu.PassingYear.toString() : "N/A",
                percentage: edu.Percentage ? `${edu.Percentage}%` : "N/A",
              };
            } else {
              return {
                level,
                instituteName: edu.CollegeName || "N/A",
                courseName: edu.CourseName || "N/A",
                specialization: edu.Specialization || "N/A",
                cgpa: edu.Percentage ? edu.Percentage.toString() : "N/A",
                startDate: edu.StartDate && edu.StartDate !== "1900-01-01" 
                  ? new Date(edu.StartDate).toLocaleDateString() 
                  : "N/A",
                endDate: edu.EndDate && edu.EndDate !== "1900-01-01" 
                  ? new Date(edu.EndDate).toLocaleDateString() 
                  : "N/A",
              };
            }
          }),
          internships: data.StudentInternships.map((intern: any) => ({
            companyName: intern.CompanyName,
            role: intern.Designation,
            duration: `${intern.InternshipDuration} months`,
            projectName: intern.ProjectName || "N/A",
            skills: intern.Skills ? intern.Skills.split(',').map(skill => skill.trim()) : [],
            projectUrl: intern.ProjectUrl || "",
            description: intern.Description || "N/A",
          })),
          projects: data.StudentProjects.map((proj: any) => ({
            projectName: proj.ProjectName,
            duration: `${proj.ProjectDuration} months`,
            description: proj.Description || "N/A",
            skills: proj.Skills ? proj.Skills.split(',').map(skill => skill.trim()) : [],
            projectUrl: proj.ProjectUrl || "",
          })),
          certifications: data.StudentCertifications.map((cert: any) => ({
            certificationName: cert.CertificationName,
            issuingOrganization: cert.IssuedBy,
            certificateId: cert.CertificationId,
            issueDate: cert.IssueDate,
            certificateUrl: cert.CertificateUrl,
          })),
        };
        
        setStudentProfile(profileData);
        
        // Fetch profile image if available
        if (profileData.avatar) {
          fetchProfileImage(profileData.avatar);
        }
      } catch (err) {
        setError("Failed to load student profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchProfileImage = async (imagePath: string) => {
      setImageLoading(true);
      try {
        const imageBlob = await GetProfileImage(imagePath);
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfileImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setProfileImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    };
    
    if (isOpen && studentId) {
      fetchStudentProfile();
    }
  }, [isOpen, studentId]);

  // Clean up the object URL when the component unmounts
  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  // Helper functions remain the same
  const getEducationLevelName = (level: Education["level"]) => {
    switch (level) {
      case "X": return "10th Grade";
      case "XII": return "12th Grade";
      case "Diploma": return "Diploma";
      case "Bachelor": return "Bachelor's Degree";
      case "Master": return "Master's Degree";
      case "PhD": return "Doctorate (PhD)";
      default: return level;
    }
  };

  const getEducationLevelIcon = (level: Education["level"]) => {
    switch (level) {
      case "X":
      case "XII":
        return <School className="h-5 w-5" />;
      case "Diploma":
      case "Bachelor":
      case "Master":
      case "PhD":
        return <University className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getEducationLevelColor = (level: Education["level"]) => {
    switch (level) {
      case "X":
      case "XII":
        return "text-blue-600 bg-blue-50";
      case "Diploma":
        return "text-purple-600 bg-purple-50";
      case "Bachelor":
        return "text-green-600 bg-green-50";
      case "Master":
        return "text-indigo-600 bg-indigo-50";
      case "PhD":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Determine education level to display in the badge
  const getEducationBadge = () => {
    if (studentProfile?.educations) {
      // Find the highest education level
      const educationLevels = ["X", "XII", "Diploma", "Bachelor", "Master", "PhD"];
      let highestLevel = "X";
      
      studentProfile.educations.forEach(edu => {
        const currentIndex = educationLevels.indexOf(edu.level);
        const highestIndex = educationLevels.indexOf(highestLevel);
        if (currentIndex > highestIndex) {
          highestLevel = edu.level;
        }
      });
      
      // Return a year based on the highest education level
      switch (highestLevel) {
        case "Bachelor": return "3rd Year";
        case "Master": return "2nd Year";
        case "PhD": return "Research Scholar";
        case "Diploma": return "Final Year";
        default: return "Student";
      }
    }
    
    return studentProfile?.education || "Student";
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Student Profile</DialogTitle>
            <DialogDescription className="text-gray-600">
              Detailed information about the student
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <SkeletonProfileHeader />
            <Separator />
            <SkeletonSection title="About" lines={3} />
            <SkeletonEducationSection />
            <SkeletonCardSection title="Internships" />
            <SkeletonProjectSection />
            <SkeletonCertificationSection />
            <SkeletonSkillsSection />
          </div>
          
          <DialogFooter>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!studentProfile) return null;

  // Rest of the component remains the same
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
          <DialogDescription>
            Detailed information about the student
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 md:w-2/5">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-white shadow-lg">
                    {imageLoading ? (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <AvatarImage src={profileImageUrl || ""} alt={studentProfile.name} />
                    )}
                    <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-800">
                      {studentProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Student Info Stack */}
                  <div className="flex flex-col items-center text-center space-y-1 w-full">
                    <h2 className="text-xl font-bold text-gray-900">{studentProfile.name}</h2>
                    
                    <p className="text-sm font-medium text-gray-700">{studentProfile.college || "N/A"}</p>
                    
                    <p className="text-xs text-gray-600">{studentProfile.registrationNumber || "N/A"}</p>
                    
                    {/* Updated: Show education level instead of year */}
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {getEducationBadge()}
                    </Badge>
                  </div>
                </div>
                
                {/* Profile Details Section */}
                <div className="p-4 md:w-3/5">
                  <div className="grid grid-cols-1 gap-3">
                    {/* Email Card */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium break-words">
                            {studentProfile.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Card */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <Phone className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium break-words">
                            {studentProfile.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Gender Card */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <User className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Gender</p>
                          <p className="text-sm font-medium break-words">
                            {studentProfile.gender || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Date of Birth Card */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Date of Birth</p>
                          <p className="text-sm font-medium break-words">
                            {studentProfile.dateOfBirth ? new Date(studentProfile.dateOfBirth).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Location Card */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="text-sm font-medium break-words">
                            {studentProfile.location || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Separator />
          
          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              About
            </h3>
            <p className="text-muted-foreground">{studentProfile.bio}</p>
          </div>
          
          {/* Education Section */}
          {studentProfile.educations && studentProfile.educations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </h3>
              <div className="space-y-3">
                {studentProfile.educations.map((education, index) => {
                  const levelColor = getEducationLevelColor(education.level);
                  return (
                    <Card key={index} className="overflow-hidden border-l-4 border-l-blue-500">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={education.level} className="border-0">
                          <AccordionTrigger className="hover:no-underline p-3 h-auto">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-3 ${levelColor}`}>
                                  {getEducationLevelIcon(education.level)}
                                </div>
                                <div className="text-left">
                                  <h4 className="font-semibold">
                                    {getEducationLevelName(education.level)}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {education.schoolName || education.instituteName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-0">
                            <div className="p-3 pt-0">
                              {education.level === "X" || education.level === "XII" ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Card className="p-2 bg-blue-50">
                                    <div className="flex items-center">
                                      <Building className="h-4 w-4 text-blue-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-blue-800">School Name</p>
                                        <p className="text-sm font-medium">{education.schoolName}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-blue-50">
                                    <div className="flex items-center">
                                      <AwardIcon className="h-4 w-4 text-blue-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-blue-800">Examination Board</p>
                                        <p className="text-sm font-medium">{education.examinationBoard}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-blue-50">
                                    <div className="flex items-center">
                                      <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-blue-800">Medium of Study</p>
                                        <p className="text-sm font-medium">{education.mediumOfStudy}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-blue-50">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-blue-800">Passing Year</p>
                                        <p className="text-sm font-medium">{education.passingYear}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-blue-50 md:col-span-2">
                                    <div className="flex items-center">
                                      <Award className="h-4 w-4 text-blue-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-blue-800">Percentage</p>
                                        <p className="text-sm font-medium">{education.percentage}</p>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <University className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">Institute Name</p>
                                        <p className="text-sm font-medium">{education.instituteName}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <GraduationCap className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">Course Name</p>
                                        <p className="text-sm font-medium">{education.courseName}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <Hash className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">Specialization</p>
                                        <p className="text-sm font-medium">{education.specialization}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <Award className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">CGPA/Percentage</p>
                                        <p className="text-sm font-medium">{education.cgpa}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">Start Date</p>
                                        <p className="text-sm font-medium">{education.startDate}</p>
                                      </div>
                                    </div>
                                  </Card>
                                  <Card className="p-2 bg-indigo-50">
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 text-indigo-600 mr-2" />
                                      <div>
                                        <p className="text-xs text-indigo-800">End Date</p>
                                        <p className="text-sm font-medium">{education.endDate}</p>
                                      </div>
                                    </div>
                                  </Card>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Internship Section */}
          {studentProfile.internships && studentProfile.internships.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Internships
              </h3>
              <div className="space-y-3">
                {studentProfile.internships.map((internship, index) => (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-purple-500">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`internship-${index}`} className="border-0">
                        <AccordionTrigger className="hover:no-underline p-3 h-auto">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg mr-3 text-purple-600 bg-purple-50">
                                <Briefcase className="h-5 w-5" />
                              </div>
                              <div className="text-left">
                                <h4 className="font-semibold">
                                  {internship.companyName}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {internship.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <div className="p-3 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <Card className="p-2 bg-purple-50">
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 text-purple-600 mr-2" />
                                  <div>
                                    <p className="text-xs text-purple-800">Company Name</p>
                                    <p className="text-sm font-medium">{internship.companyName}</p>
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50">
                                <div className="flex items-center">
                                  <Hash className="h-4 w-4 text-purple-600 mr-2" />
                                  <div>
                                    <p className="text-xs text-purple-800">Role/Position</p>
                                    <p className="text-sm font-medium">{internship.role}</p>
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                                  <div>
                                    <p className="text-xs text-purple-800">Duration</p>
                                    <p className="text-sm font-medium">{internship.duration}</p>
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50">
                                <div className="flex items-center">
                                  <BookOpen className="h-4 w-4 text-purple-600 mr-2" />
                                  <div>
                                    <p className="text-xs text-purple-800">Project Name</p>
                                    <p className="text-sm font-medium">{internship.projectName || "N/A"}</p>
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50 md:col-span-2">
                                <div className="flex items-center">
                                  <Link className="h-4 w-4 text-purple-600 mr-2" />
                                  <div>
                                    <p className="text-xs text-purple-800">Project URL</p>
                                    {internship.projectUrl ? (
                                      <a 
                                        href={internship.projectUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-purple-600 hover:underline flex items-center"
                                      >
                                        {internship.projectUrl}
                                        <ExternalLink className="h-3 w-3 ml-1" />
                                      </a>
                                    ) : (
                                      <p className="text-sm font-medium">N/A</p>
                                    )}
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50 md:col-span-2">
                                <div className="flex items-start">
                                  <BookOpen className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-purple-800">Description</p>
                                    <p className="text-sm font-medium">{internship.description || "N/A"}</p>
                                  </div>
                                </div>
                              </Card>
                              <Card className="p-2 bg-purple-50 md:col-span-2">
                                <div className="flex items-start">
                                  <Hash className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-purple-800">Skills</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {internship.skills?.map((skill, skillIndex) => (
                                        <Badge key={skillIndex} variant="secondary" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {studentProfile.projects && studentProfile.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FolderOpen className="h-5 w-5 mr-2" />
                Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentProfile.projects.map((project, index) => (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-teal-500 shadow-sm">
                    <CardHeader className="pb-3 bg-teal-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <FolderOpen className="h-5 w-5 text-teal-600 mr-2" />
                          <CardTitle className="text-base font-semibold text-gray-900">
                            {project.projectName}
                          </CardTitle>
                        </div>
                        <div className="flex items-center text-xs text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3 mr-1" />
                          {project.duration}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-700">{project.description}</p>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <Code className="h-4 w-4 text-teal-600 mr-1" />
                            <span className="text-xs font-medium text-teal-800">Skills Used</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} variant="secondary" className="text-xs bg-teal-50 text-teal-800 hover:bg-teal-100">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {project.projectUrl && (
                          <div>
                            <div className="flex items-center mb-1">
                              <Link className="h-4 w-4 text-teal-600 mr-1" />
                              <span className="text-xs font-medium text-teal-800">Project URL</span>
                            </div>
                            <a 
                              href={project.projectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-teal-600 hover:underline flex items-center truncate"
                            >
                              {project.projectUrl}
                              <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications Section */}
          {studentProfile.certifications && studentProfile.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {studentProfile.certifications.map((cert, index) => (
                  <Card key={index} className="shadow-sm border-l-4 border-l-amber-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <Award className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                          <h4 className="font-semibold text-gray-900">{cert.certificationName}</h4>
                        </div>
                        <p className="text-sm text-gray-600">{cert.issuingOrganization}</p>
                        <div className="space-y-1">
                          {cert.certificateId && (
                            <p className="text-xs text-gray-500">ID: {cert.certificateId}</p>
                          )}
                          {cert.issueDate && (
                            <p className="text-xs text-gray-500">Issued: {cert.issueDate}</p>
                          )}
                        </div>
                        {cert.certificateUrl && (
                          <a 
                            href={cert.certificateUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center"
                          >
                            View Certificate
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {studentProfile.skills?.map((skill, index) => (
                <div key={index} className="bg-indigo-50 text-indigo-800 rounded-lg py-2 px-3 text-center text-sm font-medium">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;