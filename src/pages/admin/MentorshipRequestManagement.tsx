import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  Mail,
  Building,
  GraduationCap,
  Briefcase,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  RotateCcw,
  UserCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StudentProfileModal from "@/components/models/StudentProfileModal";
import { BindTechnicalStacks } from "@/api/commonService";
import { GetStudentMentorshipRequestsCount } from "@/api/admin/MentorshipRequest";
import { GetMentorshipRequestList, RequestParameters } from "@/api/admin/MentorshipRequest";
import { GetProfileImage } from "@/api/userServices";
import { AcceptDenieUndoStudentMentorshipRequest } from "@/api/admin/MentorshipRequest";

// API response interface for technical stacks
interface TechnicalStack {
  domainId: number;
  domainName: string;
  stackId: number;
  stackName: string;
}

// API response interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Stats data interface
interface StatsData {
  totalRequests: number;
  pendingRequest: number;
  acceptedRequest: number;
  deniedRequest: number;
}

// API mentorship request interface
interface ApiMentorshipRequest {
  requestId: number;
  studentId: number;
  studentName: string;
  email: string;
  type: "skill" | "project";
  domainName: string;
  stackName: string;
  deniedMessage: string | null;
  status: string;
  date: string;
  totalRequests: number;
  profileImage: string | null;
}

// Mentorship request interface for the component
interface MentorshipRequest {
  id: string;
  studentId: number; // Added studentId field
  studentName: string;
  studentEmail: string;
  mentorshipType: "skill" | "project";
  domain: string;
  stack: string;
  status: "pending" | "accepted" | "denied";
  requestDate: string;
  denialReason?: string;
  profileImage: string | null;
}

// Mentorship request types
const MENTORSHIP_TYPES = {
  ALL: "all",
  SKILL: "skill",
  PROJECT: "project",
};

// Status types
const STATUS_TYPES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DENIED: "denied",
};

// Status badge colors
const STATUS_BADGE_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  denied: "bg-red-100 text-red-800",
};

const MentorshipRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MentorshipRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mentorshipTypeFilter, setMentorshipTypeFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("All Domains");
  const [stackFilter, setStackFilter] = useState<string>("All Stacks");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRequestsPerPage] = useState<number>(5);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [isDenyModalOpen, setIsDenyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MentorshipRequest | null>(null);
  const [denialReason, setDenialReason] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null); // Changed from email to ID
  const [technicalStacks, setTechnicalStacks] = useState<TechnicalStack[]>([]);
  const [domains, setDomains] = useState<string[]>(["All Domains"]);
  const [stacks, setStacks] = useState<string[]>(["All Stacks"]);
  
  // State for profile images
  const [profileImageUrls, setProfileImageUrls] = useState<Record<string, string>>({});
  const profileImageUrlsRef = useRef<Record<string, string>>({});
  
  // State for processing actions
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<"accept" | "deny" | "undo" | null>(null);
  
  // Use refs to track initial mount and prevent double API calls
  const isInitialMount = useRef(true);
  const technicalStacksFetched = useRef(false);
  const initialDataFetched = useRef(false);

  // Update ref when profileImageUrls changes
  useEffect(() => {
    profileImageUrlsRef.current = profileImageUrls;
  }, [profileImageUrls]);

  // Fetch stats data on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await GetStudentMentorshipRequestsCount();
        console.log("Request count:",response)
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch technical stacks on component mount
  useEffect(() => {
    const fetchTechnicalStacks = async () => {
      if (technicalStacksFetched.current) return;
      
      try {
        setLoading(true);
        const response = await BindTechnicalStacks();
        setTechnicalStacks(response.data);

        // Extract unique domains
        const uniqueDomains = Array.from(
          new Set<string>(response.data.map((item: TechnicalStack) => item.domainName))
        );
        setDomains(["All Domains", ...uniqueDomains]);

        // Extract unique stacks
        const uniqueStacks = Array.from(
          new Set<string>(response.data.map((item: TechnicalStack) => item.stackName))
        );
        setStacks(["All Stacks"]);
        
        technicalStacksFetched.current = true;
      } catch (error) {
        console.error("Error fetching technical stacks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicalStacks();
  }, []);

  // Single useEffect for fetching mentorship requests based on all dependencies
  useEffect(() => {
    // Skip on initial mount to prevent double API call
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const fetchMentorshipRequests = async () => {
      try {
        setLoading(true);
        
        // Prepare parameters for API call
        const params: RequestParameters = {
          pageNumber: currentPage,
          pageSize: requestsPerPage,
        };

        // Set type filter
        if (mentorshipTypeFilter !== "all") {
          params.type = mentorshipTypeFilter;
        }

        // Set domain filter
        if (domainFilter !== "All Domains") {
          const domain = technicalStacks.find(stack => stack.domainName === domainFilter);
          if (domain) {
            params.domainId = domain.domainId;
          }
        }

        // Set stack filter
        if (stackFilter !== "All Stacks") {
          const stack = technicalStacks.find(s => s.stackName === stackFilter);
          if (stack) {
            params.stackId = stack.stackId;
          }
        }

        // Set status filter
        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        const response = await GetMentorshipRequestList(params);
        console.log(response)
        
        // Map API response to component interface
        const mappedRequests: MentorshipRequest[] = response.data.map((item: ApiMentorshipRequest) => ({
          id: item.requestId.toString(),
          studentId: item.studentId, // Include studentId
          studentName: item.studentName,
          studentEmail: item.email,
          mentorshipType: item.type,
          domain: item.domainName,
          stack: item.stackName,
          status: item.status,
          requestDate: item.date,
          denialReason: item.deniedMessage || undefined,
          profileImage: item.profileImage,
        }));

        setRequests(mappedRequests);
        
        // Set total requests count from the first item (all items have the same total count)
        if (response.data.length > 0) {
          setTotalRequests(response.data[0].totalRequests);
        } else {
          setTotalRequests(0);
        }
      } catch (error) {
        console.error("Error fetching mentorship requests:", error);
        setRequests([]);
        setTotalRequests(0);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if technical stacks are loaded or if we're not on initial load
    if (technicalStacks.length > 0 || initialDataFetched.current) {
      fetchMentorshipRequests();
      initialDataFetched.current = true;
    }
  }, [currentPage, requestsPerPage, mentorshipTypeFilter, domainFilter, stackFilter, statusFilter, technicalStacks]);

  // Update stacks when domain changes
  useEffect(() => {
    if (domainFilter === "All Domains") {
      // Show all stacks when "All Domains" is selected
      const allStacks = Array.from(
        new Set(technicalStacks.map((item: TechnicalStack) => item.stackName))
      );
      setStacks(["All Stacks"]);
    } else {
      // Filter stacks based on selected domain
      const filteredStacks = technicalStacks
        .filter((item: TechnicalStack) => item.domainName === domainFilter)
        .map((item: TechnicalStack) => item.stackName);
      setStacks(["All Stacks", ...filteredStacks]);
    }
    // Reset stack filter to "All Stacks" when domain changes
    setStackFilter("All Stacks");
  }, [domainFilter, technicalStacks]);

  // Filter requests based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRequests(requests);
      return;
    }

    const filtered = requests.filter(
      (request) =>
        request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.stack.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredRequests(filtered);
  }, [searchTerm, requests]);

  // Fetch profile images for students
  useEffect(() => {
    const fetchProfileImages = async () => {
      const currentProfileImageUrls = profileImageUrlsRef.current;
      const emailsToFetch: string[] = [];
      
      // Find students with profile images that haven't been fetched yet
      filteredRequests.forEach(request => {
        if (request.profileImage && !currentProfileImageUrls[request.studentEmail]) {
          emailsToFetch.push(request.studentEmail);
        }
      });

      if (emailsToFetch.length === 0) return;

      const newUrls: Record<string, string> = {};
      const promises = emailsToFetch.map(async (email) => {
        try {
          const request = filteredRequests.find(r => r.studentEmail === email);
          if (request && request.profileImage) {
            const imageBlob = await GetProfileImage(request.profileImage);
            const imageUrl = URL.createObjectURL(imageBlob);
            newUrls[email] = imageUrl;
          }
        } catch (error) {
          console.error(`Error fetching profile image for ${email}:`, error);
        }
      });

      await Promise.all(promises);

      if (Object.keys(newUrls).length > 0) {
        setProfileImageUrls(prev => ({ ...prev, ...newUrls }));
      }
    };

    fetchProfileImages();
  }, [filteredRequests]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(profileImageUrls).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // Handle accept action
  const handleAccept = async (id: string) => {
    setProcessingId(id);
    setProcessingAction("accept");
    
    try {
      await AcceptDenieUndoStudentMentorshipRequest({
        requestId: parseInt(id),
        remark: "accepted",
      });
      
      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "accepted" } : request
        )
      );
      setFilteredRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: "accepted" } : request
        )
      );
      
      // Fetch updated stats
      try {
        const statsResponse = await GetStudentMentorshipRequestsCount();
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching updated stats:", error);
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Handle deny action
  const handleDeny = (request: MentorshipRequest) => {
    setSelectedRequest(request);
    setIsDenyModalOpen(true);
  };

  // Confirm deny action
  const confirmDeny = async () => {
    if (!selectedRequest || !denialReason.trim()) return;
    
    setProcessingId(selectedRequest.id);
    setProcessingAction("deny");
    
    try {
      await AcceptDenieUndoStudentMentorshipRequest({
        requestId: parseInt(selectedRequest.id),
        remark: "denied",
        deniedMessage: denialReason,
      });
      
      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, status: "denied", denialReason }
            : request
        )
      );
      setFilteredRequests((prev) =>
        prev.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, status: "denied", denialReason }
            : request
        )
      );
      
      // Fetch updated stats
      try {
        const statsResponse = await GetStudentMentorshipRequestsCount();
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching updated stats:", error);
      }
      
      // Close modal and reset
      setIsDenyModalOpen(false);
      setDenialReason("");
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error denying request:", error);
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Handle undo action
  const handleUndo = async (id: string) => {
    setProcessingId(id);
    setProcessingAction("undo");
    
    try {
      await AcceptDenieUndoStudentMentorshipRequest({
        requestId: parseInt(id),
        remark: "pending",
      });
      
      // Update local state
      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: "pending", denialReason: undefined }
            : request
        )
      );
      setFilteredRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? { ...request, status: "pending", denialReason: undefined }
            : request
        )
      );
      
      // Fetch updated stats
      try {
        const statsResponse = await GetStudentMentorshipRequestsCount();
        setStats(statsResponse.data);
      } catch (error) {
        console.error("Error fetching updated stats:", error);
      }
    } catch (error) {
      console.error("Error undoing request:", error);
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  // Handle view profile action - Updated to use studentId
  const handleViewProfile = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsProfileModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle requests per page change
  const handleRequestsPerPageChange = (value: string) => {
    const newRequestsPerPage = parseInt(value, 10);
    setRequestsPerPage(newRequestsPerPage);
    setCurrentPage(1);
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
    return type === "skill" ? (
      <GraduationCap className="h-4 w-4" />
    ) : (
      <Briefcase className="h-4 w-4" />
    );
  };

  // Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Format denial reason for display
  const formatDenialReason = (reason?: string) => {
    if (!reason) return null;
    
    // If the reason is short enough, display it as is
    if (reason.length <= 80) return reason;
    
    // If the reason is longer, try to break it at a space near the middle
    const midPoint = Math.floor(reason.length / 2);
    const breakPoint = reason.indexOf(' ', midPoint - 10);
    
    if (breakPoint !== -1) {
      return (
        <>
          {reason.slice(0, breakPoint)}
          <br />
          {truncateText(reason.slice(breakPoint + 1), 40)}
        </>
      );
    }
    
    // If no space found, just truncate
    return truncateText(reason, 80);
  };

  // Pagination
  const totalPages = Math.ceil(totalRequests / requestsPerPage);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setMentorshipTypeFilter("all");
    setDomainFilter("All Domains");
    setStackFilter("All Stacks");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Export data as CSV
  const exportData = () => {
    const headers = [
      "ID",
      "Student Name",
      "Email",
      "Mentorship Type",
      "Domain",
      "Stack",
      "Status",
      "Request Date",
      "Denial Reason",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredRequests.map((request) =>
        [
          request.id,
          request.studentName,
          request.studentEmail,
          request.mentorshipType,
          request.domain,
          request.stack,
          request.status,
          request.requestDate,
          request.denialReason || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "mentorship_requests.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SidebarLayout>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Mentorship Request Management
                </h1>
                <p className="text-muted-foreground">
                  Manage and respond to mentorship requests from students
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
                <Button variant="outline" size="sm" onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Cards - 2 per row on mobile, 4 per row on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Requests
                      </p>
                      {statsLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {stats?.totalRequests || 0}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                      <Calendar className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      {statsLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {stats?.pendingRequest || 0}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg mr-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accepted</p>
                      {statsLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {stats?.acceptedRequest || 0}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg mr-4">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Denied</p>
                      {statsLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <p className="text-2xl font-bold">
                          {stats?.deniedRequest || 0}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters - 2 per row on mobile, 5 per row on desktop */}
            <Card className="mb-6">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select
                    value={mentorshipTypeFilter}
                    onValueChange={setMentorshipTypeFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mentorship Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="skill">Skill</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={domainFilter} onValueChange={setDomainFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Domain" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto scrollbar-hide">
                      {domains.map((domain) => (
                        <SelectItem key={domain} value={domain}>
                          {domain}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={stackFilter} onValueChange={setStackFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stack" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto scrollbar-hide">
                      {stacks.map((stack) => (
                        <SelectItem key={stack} value={stack}>
                          {stack}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Request List - Desktop View (Table) */}
            <Card className="hidden md:block mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Mentorship Requests</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-48">
                          Student
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-24">
                          Type
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-64">
                          Domain & Stack
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-32">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-28">
                          Date
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-40">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2 text-muted-foreground">Loading requests...</p>
                          </td>
                        </tr>
                      ) : filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center">
                            <p className="text-muted-foreground">No requests found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((request) => (
                          <tr
                            key={request.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage
                                    src={profileImageUrls[request.studentEmail]}
                                    alt={request.studentName}
                                  />
                                  <AvatarFallback>
                                    {request.studentName
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {request.studentName}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {request.studentEmail}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                {getMentorshipTypeIcon(request.mentorshipType)}
                                <span className="ml-2 capitalize">
                                  {request.mentorshipType}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium">
                                  {request.domain}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {request.stack}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                {getStatusBadge(request.status)}
                                {request.status === "denied" &&
                                  request.denialReason && (
                                    <div
                                      className="text-xs text-red-600 mt-1 max-w-xs"
                                      title={request.denialReason}
                                    >
                                      {formatDenialReason(request.denialReason)}
                                    </div>
                                  )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">
                                {new Date(
                                  request.requestDate
                                ).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                          handleViewProfile(request.studentId) // Updated to use studentId
                                        }
                                      >
                                        <UserCircle className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View Profile</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                {request.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleAccept(request.id)}
                                      disabled={processingId === request.id && processingAction === "accept"}
                                    >
                                      {processingId === request.id && processingAction === "accept" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Accept"
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDeny(request)}
                                      disabled={processingId === request.id && processingAction === "deny"}
                                    >
                                      {processingId === request.id && processingAction === "deny" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        "Deny"
                                      )}
                                    </Button>
                                  </>
                                )}
                                {request.status !== "pending" && (
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleUndo(request.id)}
                                          disabled={processingId === request.id && processingAction === "undo"}
                                        >
                                          {processingId === request.id && processingAction === "undo" ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <RotateCcw className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Undo - Back to Pending</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Request List - Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">Loading requests...</p>
                  </CardContent>
                </Card>
              ) : filteredRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No requests found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredRequests.map((request) => (
                  <Card
                    key={request.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-3">
                            <AvatarImage
                              src={profileImageUrls[request.studentEmail]}
                              alt={request.studentName}
                            />
                            <AvatarFallback>
                              {request.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {request.studentName}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {request.studentEmail}
                            </div>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Type
                          </div>
                          <div className="flex items-center">
                            {getMentorshipTypeIcon(request.mentorshipType)}
                            <span className="ml-1 capitalize text-sm">
                              {request.mentorshipType}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Date
                          </div>
                          <div className="text-sm">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-xs text-muted-foreground">
                          Domain & Stack
                        </div>
                        <div className="text-sm">
                          {request.domain} / {request.stack}
                        </div>
                      </div>

                      {request.status === "denied" && request.denialReason && (
                        <div className="mb-3">
                          <div className="text-xs text-muted-foreground">
                            Denial Reason
                          </div>
                          <div className="text-sm text-red-600">
                            {request.denialReason.length > 100
                              ? request.denialReason.substring(0, 100) + "..."
                              : request.denialReason}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 min-w-[100px]"
                          onClick={() => handleViewProfile(request.studentId)} // Updated to use studentId
                        >
                          <UserCircle className="h-4 w-4 mr-1" />
                          Profile
                        </Button>

                        {request.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 min-w-[80px]"
                              onClick={() => handleAccept(request.id)}
                              disabled={processingId === request.id && processingAction === "accept"}
                            >
                              {processingId === request.id && processingAction === "accept" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 min-w-[80px]"
                              onClick={() => handleDeny(request)}
                              disabled={processingId === request.id && processingAction === "deny"}
                            >
                              {processingId === request.id && processingAction === "deny" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Deny"
                              )}
                            </Button>
                          </>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 min-w-[80px]"
                                  onClick={() => handleUndo(request.id)}
                                  disabled={processingId === request.id && processingAction === "undo"}
                                >
                                  {processingId === request.id && processingAction === "undo" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <RotateCcw className="h-4 w-4 mr-1" />
                                      Undo
                                    </>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Back to Pending</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalRequests > 0 && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-4 md:space-y-0">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * requestsPerPage + 1} to{" "}
                  {Math.min(currentPage * requestsPerPage, totalRequests)} of{" "}
                  {totalRequests} requests
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Requests per page:
                    </span>
                    <Select
                      value={requestsPerPage.toString()}
                      onValueChange={handleRequestsPerPageChange}
                    >
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredRequests.length === 0 && (
              <Card className="mt-6">
                <CardContent className="p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-muted rounded-full">
                      <Filter className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No requests found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search term to find what
                    you're looking for.
                  </p>
                  <Button onClick={resetFilters}>Reset Filters</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarLayout>

      {/* Deny Reason Modal */}
      <Dialog open={isDenyModalOpen} onOpenChange={setIsDenyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deny Mentorship Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for denying this mentorship request. This
              will be shared with the student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="denialReason">Reason for Denial</Label>
              <Textarea
                id="denialReason"
                placeholder="Enter the reason for denying this request..."
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDenyModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDeny} 
              disabled={!denialReason.trim() || (processingId === selectedRequest?.id && processingAction === "deny")}
            >
              {processingId === selectedRequest?.id && processingAction === "deny" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm Denial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student Profile Modal - Updated to use studentId */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        studentId={selectedStudentId} // Updated to pass studentId instead of studentEmail
      />
    </>
  );
};

export default MentorshipRequestManagement;