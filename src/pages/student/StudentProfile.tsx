import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Trash2,
  User,
  GraduationCap,
  Award,
  Briefcase,
  Code,
  FolderOpen,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Search,
  ExternalLink,
  AlertTriangle,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import maleAvatar from "@/assets/avatars/male-1.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Import existing modal components
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ProfileEditModal } from "@/components/models/student/ProfileEditModal";
import { EducationModal } from "@/components/models/student/EducationModal";
import { CertificationModal } from "@/components/models/student/CertificationModal";
import { InternshipModal } from "@/components/models/student/InternshipModal";
import { SkillsModal } from "@/components/models/student/SkillsModal";
import { ProjectModal } from "@/components/models/student/ProjectModal";
import { ResumeUploadModal } from "@/components/models/student/ResumeUploadModal";
import ProfileImageModal from "@/components/models/ProfileImageModal"; // Import the new modal
import { getStudentProfileData } from "@/api/studentServices";
import { GetProfileImage } from "@/api/userServices";
import { useUser } from "@/contexts/UserContext";
import {
  DeleteStudentEducation,
  DeleteStudentCertification,
  DeleteStudentInternship,
  DeleteStudentProject,
  DeleteStudentResume,
} from "@/api/studentServices"; // Import delete services

interface StudentProfileProps {
  student: {
    name: string;
    profileScore: number;
    college: string;
    registrationNo: string;
    gender: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    profileImage?: string; // This is now the filename
    education: Array<{
      id: string;
      level: string;
      institution: string;
      year: string;
      grade: string;
      examinationBoard?: string;
      mediumOfStudy?: string;
      passingYear?: string;
      courseName?: string;
      specialization?: string;
      startDate?: string;
      endDate?: string;
    }>;
    certifications: Array<{
      id: string;
      name: string;
      issuer: string;
      date: string;
      certificationId?: string;
      certificateUrl?: string;
    }>;
    internships: Array<{
      id: string;
      company: string;
      role: string;
      duration: string;
      description: string;
      projectName?: string;
      skills?: string;
      projectUrl?: string;
    }>;
    skills: string[];
    projects: Array<{
      id: string;
      title: string;
      description: string;
      techStack: string[];
      links: string[];
      projectDuration: number;
    }>;
    resume?: {
      fileName: string;
      uploadDate: string;
    } | null;
  };
  refreshStudentData: () => void;
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isDeleting?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            {message}
            {itemName && (
              <span className="font-medium text-foreground"> "{itemName}"</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  refreshStudentData,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);
  const [isCertificationModalOpen, setIsCertificationModalOpen] =
    useState(false);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);
  const [isInternshipModalOpen, setIsInternshipModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [showImageActions, setShowImageActions] = useState(false);

  // State for profile image
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: string;
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  console.log(student);

  // Fetch profile image when component mounts or when profileImage changes
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!student.profileImage) {
        setProfileImageUrl(null);
        return;
      }

      setImageLoading(true);
      setImageError(null);

      try {
        const imageBlob = await GetProfileImage(student.profileImage);
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfileImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        setImageError("Failed to load profile image");
        setProfileImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    };

    fetchProfileImage();

    // Clean up the object URL when the component unmounts or when the image changes
    return () => {
      if (profileImageUrl) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [student.profileImage]);

  const getScoreColor = (score: number) => {
    if (score <= 40) {
      return {
        ring: "#ef4444",
        badge: "bg-red-500",
        text: "text-red-500",
      };
    } else if (score <= 70) {
      return {
        ring: "#f59e0b",
        badge: "bg-amber-500",
        text: "text-amber-500",
      };
    } else {
      return {
        ring: "#10b981",
        badge: "bg-emerald-500",
        text: "text-emerald-500",
      };
    }
  };

  const ProfileImageWithScore = ({
    imageUrl,
    name,
    score,
  }: {
    imageUrl?: string;
    name: string;
    score: number;
  }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
    const colors = getScoreColor(score);

    return (
      <div className="relative w-40 h-40 md:w-40 md:h-40">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={colors.ring}
            strokeWidth="6"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform="rotate(90 50 50)"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        <div className="absolute inset-4 rounded-full overflow-hidden border-4 border-white shadow-md">
          {imageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Avatar className="w-full h-full">
              <AvatarImage
                src={imageUrl || maleAvatar}
                alt={name}
                onError={() => setImageError("Failed to load image")}
              />
              <AvatarFallback className="text-xl bg-profile-gradient text-white">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${colors.badge} text-white rounded-xl w-9 h-6 flex items-center justify-center text-xs font-bold shadow-lg`}
        >
          {score}%
        </div>
      </div>
    );
  };

  const handleEditEducation = (education: any) => {
    setSelectedEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleAddEducation = () => {
    setSelectedEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditCertification = (certification: any) => {
    setSelectedCertification(certification);
    setIsCertificationModalOpen(true);
  };

  const handleAddCertification = () => {
    setSelectedCertification(null);
    setIsCertificationModalOpen(true);
  };

  const handleEditInternship = (internship: any) => {
    setSelectedInternship(internship);
    setIsInternshipModalOpen(true);
  };

  const handleAddInternship = () => {
    setSelectedInternship(null);
    setIsInternshipModalOpen(true);
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setIsProjectModalOpen(true);
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsProjectModalOpen(true);
  };

  // Delete handlers
  const handleDeleteClick = (type: string, id: string, name: string) => {
    setDeleteConfig({
      type,
      id: parseInt(id),
      name,
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfig) return;
    setIsDeleting(true);
    try {
      switch (deleteConfig.type) {
        case "education":
          await DeleteStudentEducation(deleteConfig.id);
          break;
        case "certification":
          await DeleteStudentCertification(deleteConfig.id);
          break;
        case "internship":
          await DeleteStudentInternship(deleteConfig.id);
          break;
        case "project":
          await DeleteStudentProject(deleteConfig.id);
          break;
        case "resume":
          await DeleteStudentResume();
          break;
        default:
          break;
      }
      refreshStudentData();
    } catch (error) {
      console.error(`Error deleting ${deleteConfig.type}:`, error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfig(null);
    }
  };

  const isSchoolLevel = (level: string) => {
    return level === "X (10th Grade)" || level === "XII (12th Grade)";
  };

  const getExistingEducationLevels = () => {
    return student.education.map((edu) => edu.level);
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6 space-y-6 md:space-y-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 mb-6 md:mb-8">
            <CardContent className="p-4 md:p-8">
              <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">
                {/* Profile Image with Score Ring */}
                <div
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setShowImageActions(true)}
                  onMouseLeave={() => setShowImageActions(false)}
                >
                  <ProfileImageWithScore
                    imageUrl={profileImageUrl || undefined}
                    name={student.name}
                    score={student.profileScore}
                  />
                  {showImageActions && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                        onClick={() => setIsProfileImageModalOpen(true)}
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {/* Profile Info */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="text-center md:text-left">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {student.name}
                      </h1>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center gap-2 self-center md:self-auto"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">College</p>
                        <p className="font-medium truncate">
                          {student.college}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Registration No
                        </p>
                        <p className="font-medium truncate">
                          {student.registrationNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{student.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date of Birth
                        </p>
                        <p className="font-medium">{student.dateOfBirth}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium truncate">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-medium truncate">
                          {student.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Profile Summary */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Profile Summary
                    </p>
                    <p className="text-foreground leading-relaxed text-sm md:text-base">
                      {student.summary}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Education Section */}
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddEducation}
                  className="flex items-center gap-2 h-9 md:h-8"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6 pt-0 md:pt-0">
                {student.education.length > 0 ? (
                  student.education.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">
                              {edu.level}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {edu.grade}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {edu.institution}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {isSchoolLevel(edu.level) ? (
                              <>
                                {edu.examinationBoard && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.examinationBoard}
                                  </Badge>
                                )}
                                {edu.mediumOfStudy && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.mediumOfStudy}
                                  </Badge>
                                )}
                                {edu.passingYear && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.passingYear}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <>
                                {edu.courseName && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.courseName}
                                  </Badge>
                                )}
                                {edu.specialization && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.specialization}
                                  </Badge>
                                )}
                                {edu.startDate && edu.endDate && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.startDate} - {edu.endDate}
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditEducation(edu)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() =>
                              handleDeleteClick("education", edu.id, edu.level)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground">
                    <GraduationCap className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">
                      No education records added yet
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Add your education details to enhance your profile
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Certification Section */}
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Award className="h-5 w-5" />
                  Certifications
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCertification}
                  className="flex items-center gap-2 h-9 md:h-8"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6 pt-0 md:pt-0">
                {student.certifications.length > 0 ? (
                  student.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex flex-col p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">
                              {cert.name}
                            </h3>
                            {cert.certificationId && (
                              <Badge variant="outline" className="text-xs">
                                ID: {cert.certificationId}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Issued by: {cert.issuer}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Issue Date: {cert.date}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditCertification(cert)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() =>
                              handleDeleteClick(
                                "certification",
                                cert.id,
                                cert.name
                              )
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {cert.certificateUrl && (
                        <div className="mt-2">
                          <a
                            href={cert.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground">
                    <Award className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">
                      No certifications added yet
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Add your certifications to showcase your expertise
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Internship Section */}
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Briefcase className="h-5 w-5" />
                  Internships
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddInternship}
                  className="flex items-center gap-2 h-9 md:h-8"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6 pt-0 md:pt-0">
                {student.internships.length > 0 ? (
                  student.internships.map((internship) => (
                    <div
                      key={internship.id}
                      className="flex flex-col p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">
                              {internship.role}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {internship.duration}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {internship.company}
                          </p>
                          {internship.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {internship.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditInternship(internship)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() =>
                              handleDeleteClick(
                                "internship",
                                internship.id,
                                internship.role
                              )
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {(internship.projectName ||
                        internship.skills ||
                        internship.projectUrl) && (
                        <div className="mt-2 space-y-1">
                          {internship.projectName && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Project:</span>{" "}
                              {internship.projectName}
                            </p>
                          )}
                          {internship.skills && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground font-medium">
                                Skills:
                              </span>
                              {internship.skills
                                .split(",")
                                .map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {skill.trim()}
                                  </Badge>
                                ))}
                            </div>
                          )}
                          {internship.projectUrl && (
                            <div>
                              <a
                                href={internship.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground">
                    <Briefcase className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">
                      No internships added yet
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Add your internship experiences to boost your profile
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Skills Section */}
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Code className="h-5 w-5" />
                  Skills
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSkillsModalOpen(true)}
                  className="flex items-center gap-2 h-9 md:h-8"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                {student.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 text-xs md:text-sm"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 text-muted-foreground">
                    <Code className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">No skills added yet</p>
                    <p className="text-xs md:text-sm mt-1">
                      Add your skills to highlight your expertise
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Projects Section */}
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 mb-6 md:mb-8">
            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <FolderOpen className="h-5 w-5" />
                Projects
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddProject}
                className="flex items-center gap-2 h-9 md:h-8"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Project</span>
              </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              {student.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {student.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">
                              {project.title}
                            </h3>
                            {project.projectDuration && (
                              <Badge variant="outline" className="text-xs">
                                {project.projectDuration} months
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() =>
                              handleDeleteClick(
                                "project",
                                project.id,
                                project.title
                              )
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.techStack.map((tech, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      {project.links && project.links.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {project.links.map((link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              View Project
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 md:py-8 text-muted-foreground">
                  <FolderOpen className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                  <p className="text-sm md:text-base">No projects added yet</p>
                  <p className="text-xs md:text-sm mt-1">
                    Add your projects to showcase your work
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Resume Upload Section */}
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Upload className="h-5 w-5" />
                Resume
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResumeModalOpen(true)}
                className="flex items-center gap-2 h-9 md:h-8"
              >
                <Upload className="h-4 w-4" />
                {student.resume ? "Update" : "Upload"}
              </Button>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              {student.resume !== null && student.resume !== undefined ? (
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-muted/30 gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="text-center sm:text-left">
                      <p className="font-medium text-sm md:text-base">
                        {student.resume.fileName.replace(/^\d+_/, "")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {student.resume.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9">
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 text-destructive"
                      onClick={() => handleDeleteClick("resume", "0", "Resume")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 md:py-8">
                  <Upload className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                  <p className="text-muted-foreground text-sm md:text-base">
                    No resume uploaded yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your resume to increase your profile score
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Modals */}
        <ProfileImageModal
          isOpen={isProfileImageModalOpen}
          onClose={() => setIsProfileImageModalOpen(false)}
          currentImage={student.profileImage}
          onUpdateSuccess={refreshStudentData}
        />
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          student={student}
          onUpdateSuccess={refreshStudentData}
        />
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={() => setIsEducationModalOpen(false)}
          education={selectedEducation}
          onUpdateSuccess={refreshStudentData}
          getExistingEducationLevels={getExistingEducationLevels}
        />
        <CertificationModal
          isOpen={isCertificationModalOpen}
          onClose={() => setIsCertificationModalOpen(false)}
          certification={selectedCertification}
          onUpdateSuccess={refreshStudentData}
        />
        <InternshipModal
          isOpen={isInternshipModalOpen}
          onClose={() => setIsInternshipModalOpen(false)}
          internship={selectedInternship}
          onUpdateSuccess={refreshStudentData}
        />
        <SkillsModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          currentSkills={student.skills}
          onUpdateSuccess={refreshStudentData}
        />
        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          project={selectedProject}
          onUpdateSuccess={refreshStudentData}
        />
        <ResumeUploadModal
          isOpen={isResumeModalOpen}
          onClose={() => setIsResumeModalOpen(false)}
          currentResume={student.resume || undefined}
          onUpdateSuccess={refreshStudentData}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteConfig(null);
          }}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deleteConfig?.type || "Item"}`}
          message={`Are you sure you want to delete this ${
            deleteConfig?.type || "item"
          }? This action cannot be undone.`}
          itemName={deleteConfig?.name}
          isDeleting={isDeleting}
        />
      </div>
    </SidebarLayout>
  );
};

// Page component that fetches data
const StudentProfilePage: React.FC = () => {
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { refetchUser } = useUser();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await getStudentProfileData();
      const parsedData = JSON.parse(response.data);

      const transformedData = {
        name: parsedData.StudentsProfileHero[0]?.StudentName || "",
        profileScore: parsedData.ProfileStrength?.ProfileStrength || 0,
        college: parsedData.StudentsProfileHero[0]?.College || "",
        registrationNo: parsedData.StudentsProfileHero[0]?.RegistrationNo || "",
        gender: parsedData.StudentsProfileHero[0]?.Gender || "",
        dateOfBirth: parsedData.StudentsProfileHero[0]?.Dob || "",
        email: parsedData.StudentsProfileHero[0]?.Email || "",
        phone: parsedData.StudentsProfileHero[0]?.PhoneNo || "",
        location: parsedData.StudentsProfileHero[0]?.CurrentLocation || "",
        summary: parsedData.StudentsProfileHero[0]?.ProfileSummary || "",
        profileImage: parsedData.StudentsProfileHero[0]?.ProfileImagePath || "", // This is now the filename
        education:
          parsedData.StudentEducation?.map((edu: any) => {
            const isSchool =
              edu.Qualification === "X (10th Grade)" ||
              edu.Qualification === "XII (12th Grade)";
            return {
              id: edu.Id.toString(),
              level: edu.Qualification || "",
              institution: isSchool
                ? edu.SchoolName || ""
                : edu.CollegeName || "",
              year: isSchool
                ? edu.PassingYear?.toString() || ""
                : `${edu.StartDate} - ${edu.EndDate}` || "",
              grade: edu.Percentage?.toString() || "",
              examinationBoard: isSchool
                ? edu.ExaminationBoard || ""
                : undefined,
              mediumOfStudy: isSchool ? edu.MediumOfStudy || "" : undefined,
              passingYear: isSchool
                ? edu.PassingYear?.toString() || ""
                : undefined,
              courseName: !isSchool ? edu.CourseName || "" : undefined,
              specialization: !isSchool ? edu.Specialization || "" : undefined,
              collegeName: !isSchool ? edu.CollegeName || "" : undefined,
              startDate: !isSchool ? edu.StartDate || "" : undefined,
              endDate: !isSchool ? edu.EndDate || "" : undefined,
            };
          }) || [],
        certifications:
          parsedData.StudentCertifications?.map((cert: any) => ({
            id: cert.Id.toString(),
            name: cert.CertificationName || "",
            issuer: cert.IssuedBy || "",
            date: cert.IssueDate || "",
            certificationId: cert.CertificationId || "",
            certificateUrl: cert.CertificateUrl || "",
          })) || [],
        internships:
          parsedData.StudentInternships?.map((intern: any) => ({
            id: intern.Id.toString(),
            company: intern.CompanyName || "",
            role: intern.Designation || "",
            duration: `${intern.InternshipDuration} months` || "",
            description: intern.Description || "",
            projectName: intern.ProjectName || "",
            skills: intern.Skills || "",
            projectUrl: intern.ProjectUrl || "",
          })) || [],
        skills: parsedData.StudentSkills?.[0]?.Skills?.split(",") || [],
        projects:
          parsedData.StudentProjects?.map((proj: any) => ({
            id: proj.Id.toString(),
            title: proj.ProjectName || "",
            description: proj.Description || "",
            techStack: proj.Skills?.split(",") || [],
            links: proj.ProjectUrl ? [proj.ProjectUrl] : [],
            projectDuration: proj.ProjectDuration || 0,
          })) || [],
        resume: parsedData.StudentResumeUrl?.ResumeUrl
          ? {
              fileName: parsedData.StudentResumeUrl?.ResumeUrl,
              uploadDate: parsedData.StudentResumeUrl?.ResumeUploadDate,
            }
          : null,
      };
      setStudentData(transformedData);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Failed to load student profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-background p-6 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const refreshStudentData = () => {
    refetchUser();
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <StudentProfile
      student={studentData}
      refreshStudentData={refreshStudentData}
    />
  );
};

export default StudentProfilePage;
