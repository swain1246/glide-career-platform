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
import { GetViewProfileDetails } from "@/api/admin/UserManagement";
import { GetProfileImage } from "@/api/userServices";

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

// API Response Types
interface StudentProfileResponse {
  StudentsProfileHero: Array<{
    UserId: number;
    FirstName: string;
    LastName: string;
    StudentName: string;
    Dob: string;
    Gender: string;
    College: string;
    Degree: string;
    RegistrationNo: string;
    PhoneNo: string;
    Email: string;
    CurrentLocation: string;
    ProfileSummary: string;
    ProfileImagePath: string;
  }>;
  StudentEducation: Array<{
    Id: number;
    UserId: number;
    Qualification: string;
    ExaminationBoard: string;
    SchoolName: string;
    MediumOfStudy: string;
    PassingYear: number;
    CourseName: string;
    Specialization: string;
    CollegeName: string;
    StartDate: string;
    EndDate: string;
    Percentage: number;
  }>;
  StudentResumeUrl: {
    ResumeUrl: string;
    ResumeUploadDate: string;
  };
  StudentSkills: Array<{
    Skills: string;
  }>;
  StudentInternships: Array<{
    Id: number;
    UserId: number;
    CompanyName: string;
    Designation: string;
    InternshipDuration: number;
    ProjectName: string;
    Description: string;
    Skills: string;
    ProjectUrl: string;
  }>;
  StudentCertifications: Array<{
    Id: number;
    UserId: number;
    CertificationName: string;
    CertificationId: string;
    IssuedBy: string;
    IssueDate: string;
    CertificateUrl: string;
  }>;
  StudentProjects: Array<{
    Id: number;
    UserId: number;
    ProjectName: string;
    ProjectDuration: number;
    Description: string;
    Skills: string;
    ProjectUrl: string;
  }>;
  ProfileStrength: {
    ProfileStrength: number;
  };
}

interface MentorProfileResponse {
  MentorProfileHero: Array<{
    Id: number;
    UserId: number;
    FirstName: string;
    LastName: string;
    MentorName: string;
    Dob: string;
    Gender: string;
    PhoneNumber: string;
    Email: string;
    CompanyName: string;
    Designation: string;
    ExperienceYears: number;
    CurrentLocation: string;
    Bio: string;
    MentorProfileImage: string;
  }>;
  MentorSkills: Array<{
    Skills: string;
  }>;
  MentorEducation: Array<{
    Id: number;
    Qualification: string;
    ExaminationBoard: string;
    SchoolName: string;
    PassingYear: number;
    CourseName: string;
    Specialization: string;
    CollegeName: string;
    StartDate: string;
    EndDate: string;
    Percentage: number;
  }>;
  MentorProfessionalDetails: Array<{
    Id: number;
    CompanyName: string;
    Designation: string;
    EmployementType: string;
    JoiningDate: string;
    CurrentlyWorking: boolean;
    YearsOfExperience: number;
    Skills: string;
    Achievements: string;
    Description: string;
  }>;
  MentorTypeDetails: Array<{
    Id: number;
    MentorType: string;
    IsActive: boolean;
    PreferredTime: string;
    SkillsStacks: string;
  }>;
  ProfileStrength: {
    ProfileStrength: number;
  };
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userId }) => {
  const [userType, setUserType] = useState<"student" | "mentor">("student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setError(null);
      setProfileImageUrl(null); // Reset image URL
      
      try {
        // Fetch profile details
        const response = await GetViewProfileDetails(parseInt(userId));
        
        if (response.success && response.data) {
          // Parse the JSON string in the data field
          const profileData = JSON.parse(response.data);
          
          // Determine if it's a student or mentor profile
          if (profileData.StudentsProfileHero) {
            // It's a student profile
            const studentData: StudentProfileResponse = profileData;
            setUserType("student");
            
            // First transform the data without the image
            const transformedStudent = transformStudentData(studentData, userId, null);
            setStudentProfile(transformedStudent);
            
            // Then fetch the profile image if available
            if (studentData.StudentsProfileHero[0]?.ProfileImagePath) {
              const fileName = studentData.StudentsProfileHero[0].ProfileImagePath|| '';
              setImageLoading(true);
              try {
                const imageBlob = await GetProfileImage(fileName);
                const imageUrl = URL.createObjectURL(imageBlob);
                setProfileImageUrl(imageUrl);
                
                // Update the profile with the image URL
                setStudentProfile(prev => prev ? {
                  ...prev,
                  profileImage: imageUrl
                } : null);
              } catch (imgError) {
                console.error("Error fetching profile image:", imgError);
                // Keep the profile without image if fetching fails
              } finally {
                setImageLoading(false);
              }
            }
            
          } else if (profileData.MentorProfileHero) {
            // It's a mentor profile
            const mentorData: MentorProfileResponse = profileData;
            setUserType("mentor");
            
            // First transform the data without the image
            const transformedMentor = transformMentorData(mentorData, userId, null);
            setMentorProfile(transformedMentor);
            
            // Then fetch the profile image if available
            if (mentorData.MentorProfileHero[0]?.MentorProfileImage) {
              const fileName = mentorData.MentorProfileHero[0].MentorProfileImage || '';
              setImageLoading(true);
              try {
                const imageBlob = await GetProfileImage(fileName);
                const imageUrl = URL.createObjectURL(imageBlob);
                setProfileImageUrl(imageUrl);
                
                // Update the profile with the image URL
                setMentorProfile(prev => prev ? {
                  ...prev,
                  profileImage: imageUrl
                } : null);
              } catch (imgError) {
                console.error("Error fetching profile image:", imgError);
                // Keep the profile without image if fetching fails
              } finally {
                setImageLoading(false);
              }
            }
          }
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An error occurred while fetching profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [isOpen, userId]);

  // Clean up the object URL when the component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [profileImageUrl]);

  // Transform student data from API format to component format
  const transformStudentData = (data: StudentProfileResponse, userId: string, imageUrl: string | null): StudentProfile => {
    const hero = data.StudentsProfileHero[0];
    
    return {
      id: userId,
      name: hero.StudentName,
      profileImage: imageUrl || "", // Use the fetched image URL
      collegeName: hero.College,
      courseName: hero.Degree,
      gender: hero.Gender,
      dateOfBirth: new Date(hero.Dob).toLocaleDateString(),
      email: hero.Email,
      phone: hero.PhoneNo,
      location: hero.CurrentLocation,
      bio: hero.ProfileSummary,
      education: data.StudentEducation.map(edu => ({
        id: edu.Id.toString(),
        qualification: edu.Qualification,
        institution: edu.CollegeName || edu.SchoolName || "",
        examinationBoard: edu.ExaminationBoard || undefined,
        passingYear: edu.PassingYear ? edu.PassingYear.toString() : undefined,
        courseName: edu.CourseName || undefined,
        specialization: edu.Specialization || undefined,
        startYear: edu.StartDate && edu.StartDate !== "1900-01-01" ? new Date(edu.StartDate).getFullYear().toString() : undefined,
        endYear: edu.EndDate && edu.EndDate !== "1900-01-01" ? new Date(edu.EndDate).getFullYear().toString() : undefined,
        percentage: `${edu.Percentage}%`
      })),
      certifications: data.StudentCertifications.map(cert => ({
        id: cert.Id.toString(),
        name: cert.CertificationName,
        issuingOrganization: cert.IssuedBy,
        certificateId: cert.CertificationId || undefined,
        issueDate: new Date(cert.IssueDate).toLocaleDateString(),
        certificateUrl: cert.CertificateUrl || undefined
      })),
      internships: data.StudentInternships.map(intern => ({
        id: intern.Id.toString(),
        companyName: intern.CompanyName,
        role: intern.Designation,
        duration: `${intern.InternshipDuration} months`,
        projectName: intern.ProjectName,
        skills: intern.Skills.split(',').map(skill => skill.trim()),
        projectUrl: intern.ProjectUrl || undefined,
        description: intern.Description
      })),
      projects: data.StudentProjects.map(proj => ({
        id: proj.Id.toString(),
        name: proj.ProjectName,
        duration: `${proj.ProjectDuration} months`,
        description: proj.Description,
        skills: proj.Skills.split(',').map(skill => skill.trim()),
        projectUrl: proj.ProjectUrl || undefined
      })),
      skills: data.StudentSkills.length > 0 ? data.StudentSkills[0].Skills.split(',').map(skill => skill.trim()) : [],
      resume: {
        fileName: data.StudentResumeUrl.ResumeUrl,
        uploadDate: new Date(data.StudentResumeUrl.ResumeUploadDate).toLocaleDateString(),
        url: data.StudentResumeUrl.ResumeUrl
      }
    };
  };

  // Transform mentor data from API format to component format
  const transformMentorData = (data: MentorProfileResponse, userId: string, imageUrl: string | null): MentorProfile => {
    const hero = data.MentorProfileHero[0];
    
    return {
      id: userId,
      name: hero.MentorName,
      profileImage: imageUrl || "", // Use the fetched image URL
      companyName: hero.CompanyName,
      designation: hero.Designation,
      gender: hero.Gender,
      dateOfBirth: new Date(hero.Dob).toLocaleDateString(),
      email: hero.Email,
      phone: hero.PhoneNumber,
      location: hero.CurrentLocation,
      bio: hero.Bio,
      education: data.MentorEducation.map(edu => ({
        id: edu.Id.toString(),
        qualification: edu.Qualification,
        institution: edu.CollegeName || edu.SchoolName || "",
        examinationBoard: edu.ExaminationBoard || undefined,
        passingYear: edu.PassingYear ? edu.PassingYear.toString() : undefined,
        courseName: edu.CourseName || undefined,
        specialization: edu.Specialization || undefined,
        startYear: edu.StartDate && edu.StartDate !== "0001-01-01" ? new Date(edu.StartDate).getFullYear().toString() : undefined,
        endYear: edu.EndDate && edu.EndDate !== "0001-01-01" ? new Date(edu.EndDate).getFullYear().toString() : undefined,
        percentage: `${edu.Percentage}%`
      })),
      experience: data.MentorProfessionalDetails.map(exp => ({
        id: exp.Id.toString(),
        companyName: exp.CompanyName,
        designation: exp.Designation,
        type: exp.EmployementType,
        joiningDate: new Date(exp.JoiningDate).toLocaleDateString(),
        yearsOfExperience: exp.YearsOfExperience,
        skills: exp.Skills.split(',').map(skill => skill.trim()),
        description: exp.Description
      })),
      skills: data.MentorSkills.length > 0 ? data.MentorSkills[0].Skills.split(',').map(skill => skill.trim()) : []
    };
  };

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

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500">Error: {error}</p>
              <Button onClick={onClose} className="mt-4">Close</Button>
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
          {userType === "student" && studentProfile ? (
            <StudentProfileComponent profile={studentProfile} imageLoading={imageLoading} />
          ) : userType === "mentor" && mentorProfile ? (
            <MentorProfileComponent profile={mentorProfile} imageLoading={imageLoading} />
          ) : (
            <div className="text-center py-8">
              <p>No profile data available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Student Profile Component
interface StudentProfileComponentProps {
  profile: StudentProfile;
  imageLoading: boolean;
}

const StudentProfileComponent: React.FC<StudentProfileComponentProps> = ({ profile, imageLoading }) => {
  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    } else if (names.length === 1) {
      return names[0].charAt(0);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              {imageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AvatarImage 
                  src={profile.profileImage} 
                  alt={profile.name} 
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-xl md:text-2xl bg-primary text-primary-foreground">
                {getInitials(profile.name)}
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
interface MentorProfileComponentProps {
  profile: MentorProfile;
  imageLoading: boolean;
}

const MentorProfileComponent: React.FC<MentorProfileComponentProps> = ({ profile, imageLoading }) => {
  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    } else if (names.length === 1) {
      return names[0].charAt(0);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero Section */}
      <div className="bg-card rounded-lg border p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-shrink-0 flex justify-center">
            <Avatar className="h-20 w-20 md:h-24 md:w-24">
              {imageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AvatarImage 
                  src={profile.profileImage} 
                  alt={profile.name} 
                  className="object-cover"
                />
              )}
              <AvatarFallback className="text-xl md:text-2xl bg-primary text-primary-foreground">
                {getInitials(profile.name)}
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