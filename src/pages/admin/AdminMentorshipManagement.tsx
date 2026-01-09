import ConfirmationModal from "@/components/common/ConfirmationModal";
import Drawer from "@/components/common/Drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  BookOpen,
  Briefcase,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
  Save,
  Search,
  Target,
  Trash2,
  X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mentorship status types
const MENTORSHIP_STATUS = {
  PENDING: "pending",
  UPCOMING: "upcoming",
  ONGOING: "ongoing",
  COMPLETED: "completed",
};

// Mentorship type mapping
const MENTORSHIP_TYPES = {
  SKILL: "skill",
  PROJECT: "project",
};

// Status badge colors
const STATUS_BADGE_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  upcoming: "bg-blue-100 text-blue-800",
  ongoing: "bg-green-100 text-green-800",
  completed: "bg-purple-100 text-purple-800",
};

// Domain options
const DOMAINS = [
  { id: "1", name: "Web Development" },
  { id: "2", name: "Mobile Development" },
  { id: "3", name: "Data Science" },
  { id: "4", name: "UI/UX Design" },
  { id: "5", name: "DevOps" },
];

// Stack options
const STACKS = [
  { id: "1", name: "MERN Stack", domainId: "1" },
  { id: "2", name: "React & Node.js", domainId: "1" },
  { id: "3", name: "Flutter", domainId: "2" },
  { id: "4", name: "React Native", domainId: "2" },
  { id: "5", name: "Python & ML", domainId: "3" },
  { id: "6", name: "TensorFlow", domainId: "3" },
  { id: "7", name: "Figma", domainId: "4" },
  { id: "8", name: "Adobe XD", domainId: "4" },
  { id: "9", name: "Docker & Kubernetes", domainId: "5" },
  { id: "10", name: "AWS", domainId: "5" },
];

// Mock students
const STUDENTS = [
  { id: "s1", name: "John Doe", email: "john@example.com" },
  { id: "s2", name: "Jane Smith", email: "jane@example.com" },
  { id: "s3", name: "Robert Johnson", email: "robert@example.com" },
  { id: "s4", name: "Emily Davis", email: "emily@example.com" },
  { id: "s5", name: "Michael Wilson", email: "michael@example.com" },
  { id: "s6", name: "Sarah Brown", email: "sarah@example.com" },
  { id: "s7", name: "David Miller", email: "david@example.com" },
  { id: "s8", name: "Lisa Taylor", email: "lisa@example.com" },
];

// Mock mentors
const MENTORS = [
  { id: "m1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "m2", name: "Sarah Williams", email: "sarah@example.com" },
  { id: "m3", name: "David Brown", email: "david@example.com" },
  { id: "m4", name: "Lisa Taylor", email: "lisa@example.com" },
  { id: "m5", name: "James Miller", email: "james@example.com" },
  { id: "m6", name: "Emma Davis", email: "emma@example.com" },
  { id: "m7", name: "Michael Wilson", email: "michael@example.com" },
  { id: "m8", name: "Olivia Jones", email: "olivia@example.com" },
];

// Interface for Mentorship Program
interface MentorshipProgram {
  id: string;
  name: string;
  mentorshipType: string;
  domainId: string;
  domainName: string;
  stackId: string;
  stackName: string;
  startDate: string;
  endDate: string;
  studentIds: string[];
  studentNames: string[];
  mentorIds: string[];
  mentorNames: string[];
  description: string;
  groupUrl: string;
  status: string;
}

// Mock mentorship programs
const mockPrograms: MentorshipProgram[] = [
  {
    id: "1",
    name: "React Fundamentals",
    mentorshipType: MENTORSHIP_TYPES.SKILL,
    domainId: "1",
    domainName: "Web Development",
    stackId: "2",
    stackName: "React & Node.js",
    startDate: "2023-07-01",
    endDate: "2023-09-30",
    studentIds: ["s1", "s2"],
    studentNames: ["John Doe", "Jane Smith"],
    mentorIds: ["m1"],
    mentorNames: ["Alex Johnson"],
    description: "Learn React fundamentals and build a portfolio project",
    groupUrl: "https://example.com/group1",
    status: MENTORSHIP_STATUS.ONGOING,
  },
  {
    id: "2",
    name: "Mobile App Development",
    mentorshipType: MENTORSHIP_TYPES.PROJECT,
    domainId: "2",
    domainName: "Mobile Development",
    stackId: "3",
    stackName: "Flutter",
    startDate: "2023-08-15",
    endDate: "2023-12-15",
    studentIds: ["s3", "s4", "s5"],
    studentNames: ["Robert Johnson", "Emily Davis", "Michael Wilson"],
    mentorIds: ["m2", "m3"],
    mentorNames: ["Sarah Williams", "David Brown"],
    description: "Build a cross-platform mobile app using Flutter",
    groupUrl: "https://example.com/group2",
    status: MENTORSHIP_STATUS.UPCOMING,
  },
  {
    id: "3",
    name: "Data Science Basics",
    mentorshipType: MENTORSHIP_TYPES.SKILL,
    domainId: "3",
    domainName: "Data Science",
    stackId: "5",
    stackName: "Python & ML",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    studentIds: ["s6", "s7"],
    studentNames: ["Sarah Brown", "David Miller"],
    mentorIds: ["m4"],
    mentorNames: ["Lisa Taylor"],
    description: "Introduction to Python for data science and machine learning",
    groupUrl: "https://example.com/group3",
    status: MENTORSHIP_STATUS.COMPLETED,
  },
  {
    id: "4",
    name: "UI Design Project",
    mentorshipType: MENTORSHIP_TYPES.PROJECT,
    domainId: "4",
    domainName: "UI/UX Design",
    stackId: "7",
    stackName: "Figma",
    startDate: "2023-09-01",
    endDate: "2023-11-30",
    studentIds: ["s8"],
    studentNames: ["Lisa Taylor"],
    mentorIds: ["m5"],
    mentorNames: ["James Miller"],
    description: "Design a complete UI for a mobile application",
    groupUrl: "https://example.com/group4",
    status: MENTORSHIP_STATUS.PENDING,
  },
];

// MultiSelect Component
interface MultiSelectProps {
  options: { id: string; name: string; email?: string }[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  placeholder: string;
  label: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  onSelectionChange,
  placeholder,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(
    (option) =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.email &&
        option.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const removeSelected = (id: string) => {
    onSelectionChange(selectedIds.filter((item) => item !== id));
  };

  const selectedItems = options.filter((option) =>
    selectedIds.includes(option.id)
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="relative">
        <div
          className="min-h-[40px] border rounded-md p-2 cursor-pointer flex flex-wrap gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedItems.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedItems.map((item) => (
              <Badge
                key={item.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {item.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelected(item.id);
                  }}
                />
              </Badge>
            ))
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md">
            <div className="p-2 border-b">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-2 text-center text-muted-foreground">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center p-2 hover:bg-muted cursor-pointer"
                    onClick={() => toggleOption(option.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option.id)}
                      onChange={() => {}}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">{option.name}</div>
                      {option.email && (
                        <div className="text-xs text-muted-foreground">
                          {option.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminMentorshipManagement: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<MentorshipProgram[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProgram, setEditingProgram] =
    useState<MentorshipProgram | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] =
    useState<MentorshipProgram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingProgram, setViewingProgram] =
    useState<MentorshipProgram | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    mentorshipType: "",
    domainId: "",
    stackId: "",
    startDate: "",
    endDate: "",
    studentIds: [] as string[],
    mentorIds: [] as string[],
    description: "",
    groupUrl: "",
  });

  // Initialize programs
  useEffect(() => {
    // Simulate API call
    const fetchPrograms = async () => {
      setLoading(true);
      setTimeout(() => {
        setPrograms(mockPrograms);
        setFilteredPrograms(mockPrograms);
        setLoading(false);
      }, 800);
    };

    fetchPrograms();
  }, []);

  // Filter programs based on status and search term
  useEffect(() => {
    let result = programs;

    if (statusFilter !== "all") {
      result = result.filter((program) => program.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (program) =>
          program.name.toLowerCase().includes(term) ||
          program.domainName.toLowerCase().includes(term) ||
          program.stackName.toLowerCase().includes(term) ||
          program.studentNames.some((name) =>
            name.toLowerCase().includes(term)
          ) ||
          program.mentorNames.some((name) => name.toLowerCase().includes(term))
      );
    }

    setFilteredPrograms(result);
  }, [programs, statusFilter, searchTerm]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      mentorshipType: "",
      domainId: "",
      stackId: "",
      startDate: "",
      endDate: "",
      studentIds: [],
      mentorIds: [],
      description: "",
      groupUrl: "",
    });
  };

  // Handle create new program
  const handleCreateProgram = () => {
    resetForm();
    setEditingProgram(null);
    setIsFormOpen(true);
  };

  // Handle edit program
  const handleEditProgram = (program: MentorshipProgram) => {
    setFormData({
      name: program.name,
      mentorshipType: program.mentorshipType,
      domainId: program.domainId,
      stackId: program.stackId,
      startDate: program.startDate,
      endDate: program.endDate,
      studentIds: program.studentIds,
      mentorIds: program.mentorIds,
      description: program.description,
      groupUrl: program.groupUrl,
    });
    setEditingProgram(program);
    setIsFormOpen(true);
  };

  // Handle view program details - Navigate to AdminProgramView with only program ID
  const handleViewDetails = (program: MentorshipProgram) => {
    // Navigate to AdminProgramView with only program ID
    navigate(`/admin/ProgramView/${program.id}`);
  };

  // Handle delete program
  const handleDeleteProgram = (program: MentorshipProgram) => {
    setProgramToDelete(program);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!programToDelete) return;

    try {
      setIsDeleting(true);

      // Simulate API call
      setTimeout(() => {
        setPrograms((prev) => prev.filter((p) => p.id !== programToDelete.id));
        toast.success("Program deleted successfully");
        setIsDeleteModalOpen(false);
        setProgramToDelete(null);
        setIsDeleting(false);
      }, 800);
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program");
      setIsDeleting(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (
      !formData.name ||
      !formData.mentorshipType ||
      !formData.domainId ||
      !formData.stackId ||
      !formData.startDate ||
      !formData.endDate ||
      formData.studentIds.length === 0 ||
      formData.mentorIds.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Find domain and stack names
    const domain = DOMAINS.find((d) => d.id === formData.domainId);
    const stack = STACKS.find((s) => s.id === formData.stackId);

    if (!domain || !stack) {
      toast.error("Invalid selection");
      return;
    }

    // Get student and mentor names
    const studentNames = formData.studentIds
      .map((id) => STUDENTS.find((s) => s.id === id)?.name || "")
      .filter(Boolean);

    const mentorNames = formData.mentorIds
      .map((id) => MENTORS.find((m) => m.id === id)?.name || "")
      .filter(Boolean);

    // Determine status based on dates
    const today = new Date();
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    let status = MENTORSHIP_STATUS.PENDING;
    if (today >= startDate && today <= endDate) {
      status = MENTORSHIP_STATUS.ONGOING;
    } else if (today < startDate) {
      status = MENTORSHIP_STATUS.UPCOMING;
    } else if (today > endDate) {
      status = MENTORSHIP_STATUS.COMPLETED;
    }

    const newProgram: MentorshipProgram = {
      id: editingProgram ? editingProgram.id : Date.now().toString(),
      name: formData.name,
      mentorshipType: formData.mentorshipType,
      domainId: formData.domainId,
      domainName: domain.name,
      stackId: formData.stackId,
      stackName: stack.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      studentIds: formData.studentIds,
      studentNames,
      mentorIds: formData.mentorIds,
      mentorNames,
      description: formData.description,
      groupUrl: formData.groupUrl,
      status: status,
    };

    if (editingProgram) {
      // Update existing program
      setPrograms((prev) =>
        prev.map((p) => (p.id === editingProgram.id ? newProgram : p))
      );
      toast.success("Program updated successfully");
    } else {
      // Add new program
      setPrograms((prev) => [...prev, newProgram]);
      toast.success("Program created successfully");
    }

    setIsFormOpen(false);
    resetForm();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const colorClass =
      STATUS_BADGE_COLORS[status as keyof typeof STATUS_BADGE_COLORS];
    return (
      <Badge className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get mentorship type icon
  const getMentorshipTypeIcon = (type: string) => {
    switch (type) {
      case MENTORSHIP_TYPES.SKILL:
        return <BookOpen className="h-4 w-4" />;
      case MENTORSHIP_TYPES.PROJECT:
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  // Get mentorship type name
  const getMentorshipTypeName = (type: string) => {
    return type === MENTORSHIP_TYPES.SKILL
      ? "Skill Mentorship"
      : "Project Mentorship";
  };

  // Get stacks for selected domain
  const getStacksForDomain = () => {
    if (!formData.domainId) return [];
    return STACKS.filter((stack) => stack.domainId === formData.domainId);
  };

  // Check if program can be edited
  const canEditProgram = (status: string) => {
    return status !== MENTORSHIP_STATUS.COMPLETED;
  };

  // Check if program can be deleted
  const canDeleteProgram = (status: string) => {
    return status === MENTORSHIP_STATUS.PENDING;
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <span className="text-foreground">Programs</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Mentorship Program Management
              </h1>
              <p className="text-muted-foreground">
                Create and manage mentorship programs for students
              </p>
            </div>
            <Button onClick={handleCreateProgram} className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Create New Program
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search programs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={MENTORSHIP_STATUS.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={MENTORSHIP_STATUS.UPCOMING}>
                        Upcoming
                      </SelectItem>
                      <SelectItem value={MENTORSHIP_STATUS.ONGOING}>
                        Ongoing
                      </SelectItem>
                      <SelectItem value={MENTORSHIP_STATUS.COMPLETED}>
                        Completed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programs List */}
          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">
                    Loading programs...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : filteredPrograms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No programs found</h3>
                <p className="text-muted-foreground mb-4">
                  {statusFilter === "all" && searchTerm === ""
                    ? "Create your first mentorship program"
                    : "Try changing your filters or search term"}
                </p>
                {statusFilter === "all" && searchTerm === "" && (
                  <Button onClick={handleCreateProgram}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Program
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Type
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Domain & Stack
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Duration
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredPrograms.map((program) => (
                        <tr key={program.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{program.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {program.studentNames.length} students,{" "}
                                {program.mentorNames.length} mentors
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {getMentorshipTypeIcon(program.mentorshipType)}
                              <span className="ml-2">
                                {getMentorshipTypeName(program.mentorshipType)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">
                                {program.domainName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {program.stackName}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm">{program.startDate}</div>
                              <div className="text-sm text-muted-foreground">
                                to {program.endDate}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(program.status)}
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewDetails(program)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                {canEditProgram(program.status) && (
                                  <DropdownMenuItem
                                    onClick={() => handleEditProgram(program)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {canDeleteProgram(program.status) && (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteProgram(program)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Program Form Drawer */}
        <Drawer
          isFlexible={false}
          maxWidth="600px"
          width="600px"
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingProgram ? "Edit Program" : "Create New Program"}
        >
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Program Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter program name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mentorship Type *
              </label>
              <Select
                value={formData.mentorshipType}
                onValueChange={(value) =>
                  handleInputChange("mentorshipType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mentorship type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MENTORSHIP_TYPES.SKILL}>
                    Skill Mentorship
                  </SelectItem>
                  <SelectItem value={MENTORSHIP_TYPES.PROJECT}>
                    Project Mentorship
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Domain *
                </label>
                <Select
                  value={formData.domainId}
                  onValueChange={(value) =>
                    handleInputChange("domainId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        {domain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Stack *
                </label>
                <Select
                  value={formData.stackId}
                  onValueChange={(value) => handleInputChange("stackId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stack" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStacksForDomain().map((stack) => (
                      <SelectItem key={stack.id} value={stack.id}>
                        {stack.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date *
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date *
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <MultiSelect
              options={STUDENTS}
              selectedIds={formData.studentIds}
              onSelectionChange={(ids) => handleInputChange("studentIds", ids)}
              placeholder="Select students"
              label="Students *"
            />

            <MultiSelect
              options={MENTORS}
              selectedIds={formData.mentorIds}
              onSelectionChange={(ids) => handleInputChange("mentorIds", ids)}
              placeholder="Select mentors"
              label="Mentors *"
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Group URL
              </label>
              <Input
                value={formData.groupUrl}
                onChange={(e) => handleInputChange("groupUrl", e.target.value)}
                placeholder="https://example.com/group"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter program description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingProgram ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </div>
        </Drawer>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProgramToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Program"
          description="Are you sure you want to delete this program? This action cannot be undone."
          confirmText="Delete"
          isLoading={isDeleting}
        />
      </div>
    </SidebarLayout>
  );
};

export default AdminMentorshipManagement;
