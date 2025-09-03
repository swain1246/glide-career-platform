import React, { useState } from "react";
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
// Import the external modal
import MentorTypeDetailsModal from "@/components/models/mentor/MentorTypeDetailsModal";
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
interface MentorTypeDetails {
  active: boolean;
  preferredTime: string;
  skills: string[];
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
  gender: string; // Added gender field
  dateOfBirth: string; // Added date of birth field
  mentorType: {
    skill: MentorTypeDetails;
    project: MentorTypeDetails;
  };
  education: Education[];
  professionalExperience: any[];
  skills: string[];
}
// Demo data for mentor profile
const demoMentorData: MentorData = {
  name: "Dr. Sarah Johnson",
  profileScore: 85,
  company: "Tech Innovations Inc.",
  designation: "Senior Software Architect",
  yearsOfExperience: 12,
  email: "sarah.johnson@techinnovations.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  bio: "Passionate software architect with over a decade of experience in building scalable systems. I enjoy mentoring junior developers and sharing knowledge about modern software development practices. Specialized in cloud-native applications and microservices architecture.",
  profileImage: "",
  gender: "Female", // Added gender
  dateOfBirth: "June 15, 1980", // Added date of birth
  mentorType: {
    skill: {
      active: true,
      preferredTime: "Weekdays 6 PM - 9 PM",
      skills: ["Cloud Architecture", "Microservices", "System Design"],
    },
    project: {
      active: false,
      preferredTime: "",
      skills: [],
    },
  },
  education: [
    {
      id: "1",
      level: "Ph.D. in Computer Science",
      institution: "Stanford University",
      year: "2010 - 2015",
      grade: "Excellent",
      courseName: "Computer Science",
      specialization: "Distributed Systems",
      startDate: "2010",
      endDate: "2015",
    } as HigherEducation,
    {
      id: "2",
      level: "Master's in Computer Science",
      institution: "MIT",
      year: "2008 - 2010",
      grade: "A+",
      courseName: "Computer Science",
      specialization: "Software Engineering",
      startDate: "2008",
      endDate: "2010",
    } as HigherEducation,
    {
      id: "3",
      level: "B.Tech in Computer Science",
      institution: "IIT Delhi",
      year: "2004 - 2008",
      grade: "9.2 GPA",
      courseName: "Computer Science",
      startDate: "2004",
      endDate: "2008",
    } as HigherEducation,
    {
      id: "4",
      level: "XII (12th Grade)",
      institution: "ABC School",
      year: "2004",
      grade: "90%",
      examinationBoard: "CBSE",
      mediumOfStudy: "English",
      passingYear: "2004",
    } as SchoolEducation,
  ],
  professionalExperience: [
    {
      id: "1",
      company: "Tech Innovations Inc.",
      designation: "Senior Software Architect",
      type: "fulltime" as const,
      joiningDate: "Jan 2018",
      currentlyWorking: true,
      yearsOfExperience: 5,
      areaOfExperience: [
        "Cloud Architecture",
        "Microservices",
        "System Design",
      ],
      description:
        "Leading the architecture team in designing scalable cloud solutions for enterprise clients.",
    },
    {
      id: "2",
      company: "Digital Solutions Ltd.",
      designation: "Software Architect",
      type: "fulltime" as const,
      joiningDate: "Mar 2015",
      currentlyWorking: false,
      yearsOfExperience: 3,
      areaOfExperience: ["Enterprise Architecture", "API Design", "DevOps"],
      description:
        "Designed and implemented microservices architecture for the company's flagship product.",
    },
    {
      id: "3",
      company: "NextGen Systems",
      designation: "Senior Developer",
      type: "fulltime" as const,
      joiningDate: "Jun 2012",
      currentlyWorking: false,
      yearsOfExperience: 3,
      areaOfExperience: [
        "Backend Development",
        "Database Design",
        "Performance Optimization",
      ],
      description:
        "Developed high-performance backend systems and optimized database queries.",
    },
  ],
  skills: [
    "Cloud Architecture",
    "Microservices",
    "System Design",
    "AWS",
    "Docker",
    "Kubernetes",
    "Java",
    "Python",
    "Node.js",
    "React",
    "MongoDB",
    "PostgreSQL",
  ],
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
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [isProfessionalModalOpen, setIsProfessionalModalOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
  const [showImageActions, setShowImageActions] = useState(false);
  
  // Mentor type states
  const [mentorTypeDetails, setMentorTypeDetails] = useState(mentor.mentorType);
  const [isMentorTypeModalOpen, setIsMentorTypeModalOpen] = useState(false);
  const [currentMentorType, setCurrentMentorType] = useState<"skill" | "project">("skill");
  
  // State for profile image
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(maleAvatar);
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
  // Handle profile image update success
  const handleImageUpdateSuccess = () => {
    // Toggle between male and female avatar for demo purposes
    setProfileImageUrl((prev) => (prev === maleAvatar ? maleAvatar : maleAvatar));
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
    // Simulate API call delay
    setTimeout(() => {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfig(null);
      refreshMentorData();
    }, 1000);
  };
  const isSchoolLevel = (level: string) => {
    return level === "X (10th Grade)" || level === "XII (12th Grade)";
  };
  const getExistingEducationLevels = () => {
    return mentor.education.map((edu) => edu.level);
  };
  // Handle mentor type toggle
  const handleMentorTypeToggle = (type: "skill" | "project", active: boolean) => {
    const updatedDetails = {
      ...mentorTypeDetails,
      [type]: {
        ...mentorTypeDetails[type],
        active,
      }
    };
    setMentorTypeDetails(updatedDetails);
    
    // Always open modal when activating a mentor type
    if (active) {
      setCurrentMentorType(type);
      setIsMentorTypeModalOpen(true);
    }
    
    // Update mentor data
    const updatedMentor = {
      ...mentor,
      mentorType: updatedDetails
    };
    refreshMentorData();
  };
  // Handle opening details modal
  const handleOpenDetailsModal = (type: "skill" | "project") => {
    setCurrentMentorType(type);
    setIsMentorTypeModalOpen(true);
  };
  // Handle details update
  const handleDetailsUpdate = (type: "skill" | "project", details: MentorTypeDetails) => {
    const updatedDetails = {
      ...mentorTypeDetails,
      [type]: details
    };
    setMentorTypeDetails(updatedDetails);
    
    // Update mentor data
    const updatedMentor = {
      ...mentor,
      mentorType: updatedDetails
    };
    refreshMentorData();
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
                    imageUrl={profileImageUrl}
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
                        <p className="text-sm text-muted-foreground">Date of Birth</p>
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
          
          {/* Mentor Type Section - Updated */}
          <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 mb-6 md:mb-8">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Mentor Type</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <div className="space-y-6">
                {/* Skill Mentor Card */}
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Skill Mentor</h3>
                        <p className="text-sm text-muted-foreground">
                          Help students develop specific skills
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={mentorTypeDetails.skill.active}
                      onCheckedChange={(checked) => handleMentorTypeToggle("skill", checked)}
                    />
                  </div>
                  
                  {mentorTypeDetails.skill.active && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Preferred Time</p>
                        <p className="text-sm text-muted-foreground">
                          {mentorTypeDetails.skill.preferredTime || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Skills</p>
                        {mentorTypeDetails.skill.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorTypeDetails.skill.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No skills added</p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDetailsModal("skill")}
                        className="mt-2"
                      >
                        Edit Details
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Project Mentor Card */}
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Project Mentor</h3>
                        <p className="text-sm text-muted-foreground">
                          Guide students through projects
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={mentorTypeDetails.project.active}
                      onCheckedChange={(checked) => handleMentorTypeToggle("project", checked)}
                    />
                  </div>
                  
                  {mentorTypeDetails.project.active && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium">Preferred Time</p>
                        <p className="text-sm text-muted-foreground">
                          {mentorTypeDetails.project.preferredTime || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Skills</p>
                        {mentorTypeDetails.project.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {mentorTypeDetails.project.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No skills added</p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDetailsModal("project")}
                        className="mt-2"
                      >
                        Edit Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                            {exp.areaOfExperience.map((area, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {area}
                              </Badge>
                            ))}
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
        
        {/* External Mentor Type Details Modal */}
        <MentorTypeDetailsModal
          isOpen={isMentorTypeModalOpen}
          onClose={() => setIsMentorTypeModalOpen(false)}
          type={currentMentorType}
          details={mentorTypeDetails[currentMentorType]}
          onUpdateSuccess={handleDetailsUpdate}
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
// Page component with demo data
const MentorProfilePage: React.FC = () => {
  const [mentorData, setMentorData] = useState(demoMentorData);
  const refreshMentorData = () => {
    // In a real app, this would fetch fresh data from the API
    // For demo purposes, we'll just keep the same data
    console.log("Refreshing mentor data...");
  };
  return (
    <MentorProfile mentor={mentorData} refreshMentorData={refreshMentorData} />
  );
};
export default MentorProfilePage;