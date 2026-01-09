// src/pages/mentor/MentorProfilePage.tsx
import React, { useState, useEffect } from "react";
import {
  Edit,
  Plus,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Camera,
  Building,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
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
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProfileImageModal from "@/components/models/ProfileImageModal";
import { ProfileEditModal } from "@/components/models/mentor/ProfileEditModal";
import { ProfessionalExperienceModal } from "@/components/models/mentor/ProfessionalExperienceModal";
import { EducationModal } from "@/components/models/mentor/EducationModel";
import { SkillsModal } from "@/components/models/mentor/SkillsModel";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MentorTypeSection from "./profile/MentorTypeSection";
import { toast } from "sonner";
import { getMenterProfileData } from "@/api/mentor/mentorProfileService";
import { GetProfileImage } from "@/api/userServices";
import {
  DeleteMentorEducation,
  DeleteMentorPerfessionalDetail,
} from "@/api/mentor/mentorProfileService";
import { useUser } from "@/contexts/UserContext";

// Define proper types for education
interface BaseEducation {
  id: string;
  level: string;
  institution: string;
  year: string;
  grade: string;
}
interface SchoolEducation extends BaseEducation {
  examinationBoard?: string;
  mediumOfStudy?: string;
  passingYear?: string;
  courseName?: never;
  specialization?: never;
  startDate?: never;
  endDate?: never;
}
interface HigherEducation extends BaseEducation {
  examinationBoard?: never;
  mediumOfStudy?: never;
  passingYear?: never;
  courseName?: string;
  specialization?: string;
  startDate?: string;
  endDate?: string;
}
type Education = SchoolEducation | HigherEducation;

// Mentor type details interface
interface DomainStack {
  id?: number;
  domain: string;
  stack: string;
  domainId?: number;
  stackId?: number;
}
interface MentorTypeDetails {
  active: boolean;
  domains: DomainStack[];
  id?: number;
}

// Updated mentor data structure
interface MentorData {
  name: string;
  profileScore: number;
  company: string;
  designation: string;
  yearsOfExperience: number;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  gender: string;
  dateOfBirth: string;
  mentorType: {
    skill: MentorTypeDetails;
    project: MentorTypeDetails;
  };
  education: Education[];
  professionalExperience: any[];
  skills: string[];
}

// Default empty mentor data structure
const defaultMentorData: MentorData = {
  name: "",
  profileScore: 0,
  company: "",
  designation: "",
  yearsOfExperience: 0,
  email: "",
  phone: "",
  location: "",
  bio: "",
  profileImage: "",
  gender: "",
  dateOfBirth: "",
  mentorType: {
    skill: {
      active: false,
      domains: [],
    },
    project: {
      active: false,
      domains: [],
    },
  },
  education: [],
  professionalExperience: [],
  skills: [],
};

interface MentorProfileProps {
  mentor: MentorData;
  refreshMentorData: () => void;
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

const MentorProfile: React.FC<MentorProfileProps> = ({
  mentor,
  refreshMentorData,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(
    null
  );
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
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

  // Fetch profile image when mentor data changes
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (mentor.profileImage) {
        try {
          setImageLoading(true);
          setImageError(null);
          const imageBlob = await GetProfileImage(mentor.profileImage);
          const imageUrl = URL.createObjectURL(imageBlob);
          setProfileImageUrl(imageUrl);
        } catch (error) {
          console.error("Error fetching profile image:", error);
          setImageError("Failed to load profile image");
          toast.error("Failed to load profile image");
          // Fallback to default avatar
          setProfileImageUrl(maleAvatar);
        } finally {
          setImageLoading(false);
        }
      } else {
        // Use default avatar if no profile image is set
        setProfileImageUrl(maleAvatar);
      }
    };
    fetchProfileImage();
    // Cleanup function to revoke object URL
    return () => {
      if (profileImageUrl && profileImageUrl !== maleAvatar) {
        URL.revokeObjectURL(profileImageUrl);
      }
    };
  }, [mentor.profileImage]);

  // Handle profile image update success
  const handleImageUpdateSuccess = () => {
    setIsProfileImageModalOpen(false);
    refreshMentorData();
  };

  const handleEditProfile = () => {
    setIsProfileModalOpen(true);
  };

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

  const handleEditEducation = (education: Education) => {
    setSelectedEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleAddEducation = () => {
    setSelectedEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditProfessional = (professional: any) => {
    setSelectedProfessional(professional);
    setIsProfessionalModalOpen(true);
  };

  const handleAddProfessional = () => {
    setSelectedProfessional(null);
    setIsProfessionalModalOpen(true);
  };

  // Handle mentor type updates
  const handleMentorTypeUpdate = (type: "skill" | "project", details: MentorTypeDetails) => {
    const updatedDetails = {
      ...mentor.mentorType,
      [type]: details,
    };
    
    // Update mentor data
    const updatedMentor = {
      ...mentor,
      mentorType: updatedDetails,
    };
    
    refreshMentorData();
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
      let response;
      
      if (deleteConfig.type === "education") {
        response = await DeleteMentorEducation(deleteConfig.id);
      } else if (deleteConfig.type === "professional") {
        response = await DeleteMentorPerfessionalDetail(deleteConfig.id);
      } else {
        throw new Error("Invalid delete type");
      }
      
      if (response.success) {
        toast.success(`${deleteConfig.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} deleted successfully`);
        refreshMentorData();
      } else {
        toast.error(
          response.message || `Failed to delete ${deleteConfig.type.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        );
      }
    } catch (error) {
      console.error(`Error deleting ${deleteConfig.type}:`, error);
      toast.error(`An error occurred while deleting the ${deleteConfig.type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
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
    return mentor.education.map((edu) => edu.level);
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
                    name={mentor.name}
                    score={mentor.profileScore}
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
                        {mentor.name}
                      </h1>
                      <div className="flex items-center gap-2 justify-center md:justify-start">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <p className="text-lg font-medium">{mentor.company}</p>
                      </div>
                      <p className="text-muted-foreground">
                        {mentor.designation}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                      className="flex items-center gap-2 self-center md:self-auto"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experience
                        </p>
                        <p className="font-medium truncate">
                          {mentor.yearsOfExperience} years
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium truncate">{mentor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{mentor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-medium truncate">
                          {mentor.location}
                        </p>
                      </div>
                    </div>
                    {/* Added Gender and Date of Birth */}
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{mentor.gender}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date of Birth
                        </p>
                        <p className="font-medium">{mentor.dateOfBirth}</p>
                      </div>
                    </div>
                  </div>
                  {/* Profile Bio */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Bio</p>
                    <p className="text-foreground leading-relaxed text-sm md:text-base">
                      {mentor.bio}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Mentor Type Section - Now using the external component */}
          <MentorTypeSection 
            mentorType={mentor.mentorType}
            onUpdateMentorType={handleMentorTypeUpdate}
            refreshMentorData={refreshMentorData}
          />
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Professional Experience Section */}
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Briefcase className="h-5 w-5" />
                  Professional Experience
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddProfessional}
                  className="flex items-center gap-2 h-9 md:h-8"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6 pt-0 md:pt-0">
                {mentor.professionalExperience.length > 0 ? (
                  mentor.professionalExperience.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm md:text-base">
                              {exp.designation}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {exp.type}
                            </Badge>
                            {exp.currentlyWorking && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1 truncate">
                            {exp.company}
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            {exp.joiningDate} -{" "}
                            {exp.currentlyWorking
                              ? "Present"
                              : `${exp.yearsOfExperience} years`}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.areaOfExperience.map(
                              (area: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {area}
                                </Badge>
                              )
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {exp.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 flex-shrink-0 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditProfessional(exp)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() =>
                              handleDeleteClick(
                                "professional",
                                exp.id,
                                exp.designation
                              )
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
                    <Briefcase className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-2 md:mb-3 opacity-50" />
                    <p className="text-sm md:text-base">
                      No professional experience added yet
                    </p>
                    <p className="text-xs md:text-sm mt-1">
                      Add your work experience to enhance your profile
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
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
                {mentor.education.length > 0 ? (
                  mentor.education.map((edu) => (
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
                                {"examinationBoard" in edu &&
                                  edu.examinationBoard && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {edu.examinationBoard}
                                    </Badge>
                                  )}
                                {"mediumOfStudy" in edu &&
                                  edu.mediumOfStudy && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {edu.mediumOfStudy}
                                    </Badge>
                                  )}
                                {"passingYear" in edu && edu.passingYear && (
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
                                {"courseName" in edu && edu.courseName && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {edu.courseName}
                                  </Badge>
                                )}
                                {"specialization" in edu &&
                                  edu.specialization && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {edu.specialization}
                                    </Badge>
                                  )}
                                {"startDate" in edu &&
                                  "endDate" in edu &&
                                  edu.startDate &&
                                  edu.endDate && (
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
          </div>
          
          {/* Skills Section */}
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 mb-6 md:mb-8">
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
              {mentor.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill, index) => (
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
        
        {/* Profile Image Modal */}
        <ProfileImageModal
          isOpen={isProfileImageModalOpen}
          onClose={() => setIsProfileImageModalOpen(false)}
          currentImage={mentor.profileImage || null}
          onUpdateSuccess={handleImageUpdateSuccess}
        />
        <ProfileEditModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          mentor={mentor}
          onUpdateSuccess={refreshMentorData}
        />
        <ProfessionalExperienceModal
          isOpen={isProfessionalModalOpen}
          onClose={() => setIsProfessionalModalOpen(false)}
          experience={selectedProfessional}
          existingExperiences={mentor.professionalExperience.map((exp) => ({
            id: exp.id,
            currentlyWorking: exp.currentlyWorking,
          }))}
          onUpdateSuccess={refreshMentorData}
        />
        <EducationModal
          isOpen={isEducationModalOpen}
          onClose={() => setIsEducationModalOpen(false)}
          education={selectedEducation}
          onUpdateSuccess={refreshMentorData}
          getExistingEducationLevels={getExistingEducationLevels}
        />
        <SkillsModal
          isOpen={isSkillsModalOpen}
          onClose={() => setIsSkillsModalOpen(false)}
          currentSkills={mentor.skills}
          onUpdateSuccess={refreshMentorData}
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

// Page component with API data
const MentorProfilePage: React.FC = () => {
  const [mentorData, setMentorData] = useState<MentorData>(defaultMentorData);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const {refetchUser} = useUser();
  
  const freshMentorData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMenterProfileData();
      if (response.success) {
        // Parse the data string
        const parsedData = JSON.parse(response.data);
        // Transform the data to match our MentorData interface
        const mentorProfileHero = parsedData.MentorProfileHero?.[0] || {};
        const mentorSkills = parsedData.MentorSkills?.[0] || { Skills: "" };
        const mentorEducation = parsedData.MentorEducation || [];
        const mentorProfessionalDetails =
          parsedData.MentorProfessionalDetails || [];
        const mentorTypeDetails = parsedData.MentorTypeDetails || [];
        const profileStrength =
          parsedData.ProfileStrength?.ProfileStrength || 0;
        
        // Format date of birth
        const formatDateOfBirth = (dateString: string) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        };
        
        // Transform education data
        const transformEducation = (): Education[] => {
          return mentorEducation.map((edu: any) => {
            const isSchool =
              edu.Qualification === "X (10th Grade)" ||
              edu.Qualification === "XII (12th Grade)";
            if (isSchool) {
              return {
                id: edu.Id?.toString() || "",
                level: edu.Qualification || "",
                institution: edu.SchoolName || "",
                year: edu.PassingYear?.toString() || "",
                grade: `${edu.Percentage || 0}%`,
                examinationBoard: edu.ExaminationBoard || "",
                passingYear: edu.PassingYear?.toString() || "",
              } as SchoolEducation;
            } else {
              // Format dates to show only year and month
              const formatDate = (dateString: string) => {
                if (!dateString) return "";
                const date = new Date(dateString);
                return `${date.getFullYear()}`;
              };
              
              return {
                id: edu.Id?.toString() || "",
                level: edu.Qualification || "",
                institution: edu.CollegeName || "",
                year: `${formatDate(edu.StartDate)} - ${formatDate(
                  edu.EndDate
                )}`,
                grade: edu.Percentage?.toString() || "",
                courseName: edu.CourseName || "",
                specialization: edu.Specialization || "",
                startDate: formatDate(edu.StartDate),
                endDate: formatDate(edu.EndDate),
              } as HigherEducation;
            }
          });
        };
        
        // Transform professional experience
        const transformProfessionalExperience = () => {
          return mentorProfessionalDetails.map((exp: any) => {
            // Format joining date
            const formatJoiningDate = (dateString: string) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              });
            };
            
            return {
              id: exp.Id?.toString() || "",
              company: exp.CompanyName || "",
              designation: exp.Designation || "",
              type: (exp.EmployementType || "")
                .toLowerCase()
                .replace("-", "") as any,
              joiningDate: formatJoiningDate(exp.JoiningDate),
              currentlyWorking: exp.CurrentlyWorking || false,
              yearsOfExperience: exp.YearsOfExperience || 0,
              areaOfExperience: exp.Skills
                ? exp.Skills.split(",").map((s: string) => s.trim())
                : [],
              description: exp.Description || "",
            };
          });
        };
        
        // Transform mentor type details
        const transformMentorTypeDetails = () => {
          const result = {
            skill: {
              active: false,
              domains: [],
            },
            project: {
              active: false,
              domains: [],
            },
          };
          
          mentorTypeDetails.forEach((item: any) => {
            const type = item.MentorType; // "skill" or "project"
            if (type === 'skill' || type === 'project') {
              result[type].active = item.IsActive;
              
              // Transform the stacks array
              result[type].domains = item.stacks.map((stack: any) => ({
                id: stack.Id,
                domain: stack.DomainName,
                stack: stack.StackName,
                domainId: stack.DomainId,
                stackId: stack.StackId
              }));
            }
          });
          
          return result;
        };
        
        // Create the transformed mentor data
        const transformedData: MentorData = {
          name: mentorProfileHero.MentorName || "",
          profileScore: profileStrength,
          company: mentorProfileHero.CompanyName || "",
          designation: mentorProfileHero.Designation || "",
          yearsOfExperience: mentorProfileHero.ExperienceYears || 0,
          email: mentorProfileHero.Email || "",
          phone: mentorProfileHero.PhoneNumber || "",
          location: mentorProfileHero.CurrentLocation || "",
          bio: mentorProfileHero.Bio || "",
          profileImage: mentorProfileHero.MentorProfileImage || "",
          gender: mentorProfileHero.Gender || "",
          dateOfBirth: formatDateOfBirth(mentorProfileHero.Dob || ""),
          mentorType: transformMentorTypeDetails(),
          education: transformEducation(),
          professionalExperience: transformProfessionalExperience(),
          skills: mentorSkills.Skills
            ? mentorSkills.Skills.split(",").map((s: string) => s.trim())
            : [],
        };
        
        setMentorData(transformedData);
      } else {
        setError(response.message || "Failed to fetch mentor profile data");
        toast.error(response.message || "Failed to fetch mentor profile data");
      }
    } catch (err: any) {
      console.error("Error fetching mentor profile data:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while fetching mentor profile data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    freshMentorData();
  }, [refreshTrigger]);
  
  const refreshMentorData = () => {
    refetchUser();
    setRefreshTrigger((prev) => prev + 1);
  };
  
  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              Loading mentor profile...
            </p>
          </div>
        </div>
      </SidebarLayout>
    );
  }
  
  if (error) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={refreshMentorData}>Try Again</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }
  return (
    <MentorProfile mentor={mentorData} refreshMentorData={refreshMentorData} />
  );
};

export default MentorProfilePage;