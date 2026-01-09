import { GetStudentMentorshipRequestList, WithdrawMentorshipRequest } from "@/api/student/mentorshipService";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import Drawer from "@/components/common/Drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import {
  BookOpen,
  Briefcase,
  Check,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Target,
  User
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import MentorshipRequestCard from "./mentorshipManagement/MentorshipRequestCard";
import MentorshipRequestForm from "./mentorshipManagement/MentorshipRequestForm";

// Mentorship status types
const MENTORSHIP_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  ACTIVE: "active",
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
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
};

// Interface for API response
interface ApiResponse<T> {
  data: T;
}

// API Mentorship Request interface
interface ApiMentorshipRequest {
  requestId: number;
  mentorshipType: string;
  domainId: number;
  stackId: number;
  message: string;
  remark: string;
  mentorshipProgramId: number;
  domainName: string;
  stackName: string;
}

// Mentorship interface
interface Mentorship {
  id: string;
  type: string;
  domain: string;
  domainId: number;
  stack: string;
  stackId: number;
  area: string;
  description: string;
  status: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  startDate: string | null;
  endDate?: string;
  tasks: Task[];
  updates: Update[];
}

// Task interface
interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

// Update interface
interface Update {
  id: string;
  title: string;
  date: string;
  content: string;
}

// Mock mentorship data (will be replaced with API data)
const mockMentorships = [
  {
    id: "1",
    type: MENTORSHIP_TYPES.SKILL,
    domain: "Full Stack Development",
    domainId: 1,
    stack: "MERN Stack (MongoDB, Express, React, Node.js)",
    stackId: 1,
    area: "Full Stack Development - MERN Stack (MongoDB, Express, React, Node.js)",
    description: "I want to improve my React and frontend development skills",
    status: MENTORSHIP_STATUS.ACTIVE,
    mentor: {
      id: "m1",
      name: "Alex Johnson",
      email: "alex@example.com",
      profileImage: null,
    },
    startDate: "2023-06-15",
    tasks: [
      {
        id: "t1",
        title: "Complete React tutorial",
        dueDate: "2023-06-20",
        completed: true,
      },
      {
        id: "t2",
        title: "Build a portfolio project",
        dueDate: "2023-07-01",
        completed: false,
      },
      {
        id: "t3",
        title: "Review session with mentor",
        dueDate: "2023-07-05",
        completed: false,
      },
    ],
    updates: [
      {
        id: "u1",
        title: "Initial meeting scheduled",
        date: "2023-06-15",
        content: "We've scheduled our first meeting for next Monday at 3 PM.",
      },
      {
        id: "u2",
        title: "Learning resources shared",
        date: "2023-06-16",
        content:
          "I've shared some useful React tutorials and documentation for you to review.",
      },
    ],
  },
];

const MentorshipManagement: React.FC = () => {
  const [mentorships, setMentorships] = useState<Mentorship[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<Mentorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingMentorship, setEditingMentorship] = useState<Mentorship | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [withdrawingRequest, setWithdrawingRequest] = useState<Mentorship | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Map API data to Mentorship interface
  const mapApiDataToMentorship = (apiData: ApiMentorshipRequest): Mentorship => {
    return {
      id: apiData.requestId.toString(),
      type: apiData.mentorshipType,
      domain: apiData.domainName,
      domainId: apiData.domainId,
      stack: apiData.stackName,
      stackId: apiData.stackId,
      area: `${apiData.domainName} - ${apiData.stackName}`,
      description: apiData.message,
      status: apiData.remark.toLowerCase(),
      mentor: null,
      startDate: null,
      tasks: [],
      updates: [],
    };
  };

  // Fetch active mentorships (mocked)
  useEffect(() => {
    // Simulate API call
    const fetchMentorships = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setMentorships(mockMentorships);
        setLoading(false);
      }, 800);
    };
    
    fetchMentorships();
  }, []);

  // Fetch mentorship requests from API
  useEffect(() => {
    const fetchMentorshipRequests = async () => {
      try {
        setRequestsLoading(true);
        const response = await GetStudentMentorshipRequestList();
        const mappedData = response.data.map(mapApiDataToMentorship);
        setMentorshipRequests(mappedData);
      } catch (error) {
        console.error("Error fetching mentorship requests:", error);
        toast.error("Failed to load mentorship requests. Please try again.");
      } finally {
        setRequestsLoading(false);
      }
    };
    
    fetchMentorshipRequests();
  }, []);

  // Handle new mentorship request
  const handleNewRequest = () => {
    setEditingMentorship(null);
    setIsDrawerOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (mentorship: Mentorship) => {
    setEditingMentorship(mentorship);
    setIsDrawerOpen(true);
  };

  // Handle withdraw button click
  const handleWithdrawClick = (mentorship: Mentorship) => {
    setWithdrawingRequest(mentorship);
    setIsConfirmModalOpen(true);
  };

  // Confirm withdrawal
  const handleConfirmWithdraw = async () => {
    if (!withdrawingRequest) return;
    
    try {
      setIsWithdrawing(true);
      
      // Call API to withdraw the request
      await WithdrawMentorshipRequest(parseInt(withdrawingRequest.id));
      
      // Show success message
      toast.success("Mentorship request withdrawn successfully.");
      
      // Close the modal
      setIsConfirmModalOpen(false);
      setWithdrawingRequest(null);
      
      // Refresh the mentorship requests list
      const refreshMentorshipRequests = async () => {
        try {
          setRequestsLoading(true);
          const response = await GetStudentMentorshipRequestList();
          const mappedData = response.data.map(mapApiDataToMentorship);
          setMentorshipRequests(mappedData);
        } catch (error) {
          console.error("Error refreshing mentorship requests:", error);
          toast.error("Failed to refresh mentorship requests.");
        } finally {
          setRequestsLoading(false);
        }
      };
      
      refreshMentorshipRequests();
    } catch (error) {
      console.error("Error withdrawing mentorship request:", error);
      toast.error("Failed to withdraw mentorship request. Please try again.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setIsDrawerOpen(false);
    setEditingMentorship(null);
    
    // Refresh mentorships list after successful submission
    setLoading(true);
    setTimeout(() => {
      setMentorships(mockMentorships);
      setLoading(false);
    }, 500);
    
    // Refresh mentorship requests
    const refreshMentorshipRequests = async () => {
      try {
        setRequestsLoading(true);
        const response = await GetStudentMentorshipRequestList();
        const mappedData = response.data.map(mapApiDataToMentorship);
        setMentorshipRequests(mappedData);
      } catch (error) {
        console.error("Error refreshing mentorship requests:", error);
        toast.error("Failed to refresh mentorship requests.");
      } finally {
        setRequestsLoading(false);
      }
    };
    
    refreshMentorshipRequests();
  };

  // Handle form close
  const handleFormClose = () => {
    setIsDrawerOpen(false);
    setEditingMentorship(null);
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

  // Filter active mentorships
  const activeMentorships = mentorships.filter(
    (m) => m.status === MENTORSHIP_STATUS.ACTIVE
  );

  // Filter completed mentorships
  const completedMentorships = mentorshipRequests.filter(
    (m) => m.status === MENTORSHIP_STATUS.COMPLETED
  );

  // Calculate task completion percentage
  const calculateTaskCompletion = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Mentorship Management
              </h1>
              <p className="text-muted-foreground">
                Request mentorships, track progress, and manage your learning
                journey
              </p>
            </div>
            <Button onClick={handleNewRequest} className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              New Mentorship Request
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Active Mentorships */}
            <div className="lg:col-span-1 space-y-6">
              {/* Active Mentorships Card */}
              {activeMentorships.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Active Mentorships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeMentorships.map((mentorship) => (
                        <div
                          key={mentorship.id}
                          className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setActiveTab("active")}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center">
                              {getMentorshipTypeIcon(mentorship.type)}
                              <span className="ml-2 font-medium">
                                {mentorship.area}
                              </span>
                            </div>
                            {getStatusBadge(mentorship.status)}
                          </div>
                          <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {mentorship.description}
                          </div>
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 mr-1" />
                            <span>{mentorship.mentor?.name}</span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>
                                {calculateTaskCompletion(mentorship.tasks)}%
                              </span>
                            </div>
                            <Progress
                              value={calculateTaskCompletion(mentorship.tasks)}
                              className="h-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Mentorship List & Details */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active Mentorships</TabsTrigger>
                  <TabsTrigger value="requests">All Requests</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  {activeMentorships.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No active mentorships
                        </h3>
                        <p className="text-muted-foreground">
                          Your active mentorships will appear here
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {activeMentorships.map((mentorship) => (
                        <Card key={mentorship.id} className="overflow-hidden">
                          {/* Mentorship Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="mb-4 md:mb-0">
                                <div className="flex items-center mb-2">
                                  {getMentorshipTypeIcon(mentorship.type)}
                                  <h2 className="ml-2 text-xl font-bold">
                                    {mentorship.area}
                                  </h2>
                                </div>
                                <div className="flex items-center mt-3">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage
                                      src={
                                        mentorship.mentor?.profileImage ||
                                        undefined
                                      }
                                    />
                                    <AvatarFallback>
                                      {mentorship.mentor?.name?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {mentorship.mentor?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {mentorship.mentor?.email}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                {getStatusBadge(mentorship.status)}
                                <p className="text-sm text-muted-foreground mt-1">
                                  Started: {mentorship.startDate}
                                </p>
                                <div className="mt-3 bg-white p-3 rounded-lg shadow-sm w-48">
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                    <span>Progress</span>
                                    <span>
                                      {calculateTaskCompletion(
                                        mentorship.tasks
                                      )}
                                      %
                                    </span>
                                  </div>
                                  <Progress
                                    value={calculateTaskCompletion(
                                      mentorship.tasks
                                    )}
                                    className="h-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Main Content */}
                          <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Tasks Section */}
                              <div>
                                <div className="flex items-center mb-4">
                                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                  <h3 className="font-semibold">Tasks</h3>
                                </div>
                                {mentorship.tasks.length === 0 ? (
                                  <p className="text-muted-foreground">
                                    No tasks assigned yet
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    {mentorship.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="flex items-start p-3 border rounded-lg"
                                      >
                                        <div
                                          className={`flex items-center justify-center h-6 w-6 rounded-full border mr-3 mt-0.5 flex-shrink-0 ${
                                            task.completed
                                              ? "bg-green-500 border-green-500"
                                              : "border-muted-foreground"
                                          }`}
                                        >
                                          {task.completed && (
                                            <Check className="h-4 w-4 text-white" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={`font-medium ${
                                              task.completed
                                                ? "line-through text-muted-foreground"
                                                : ""
                                            }`}
                                          >
                                            {task.title}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            Due: {task.dueDate}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Updates Section */}
                              <div>
                                <div className="flex items-center mb-4">
                                  <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                                  <h3 className="font-semibold">Updates</h3>
                                </div>
                                {mentorship.updates.length === 0 ? (
                                  <p className="text-muted-foreground">
                                    No updates yet
                                  </p>
                                ) : (
                                  <div className="space-y-4">
                                    {mentorship.updates.map((update) => (
                                      <div
                                        key={update.id}
                                        className="border-l-2 border-blue-200 pl-4 py-1"
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <h4 className="font-medium">
                                            {update.title}
                                          </h4>
                                          <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded">
                                            {update.date}
                                          </span>
                                        </div>
                                        <p className="text-sm">
                                          {update.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="requests" className="mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-lg">
                          Your Mentorship Requests
                        </CardTitle>
                        <div className="relative mt-2 md:mt-0">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search requests..."
                            className="pl-10 w-full md:w-64"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {requestsLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2 text-muted-foreground">
                              Loading mentorship requests...
                            </p>
                          </div>
                        </div>
                      ) : mentorshipRequests.length === 0 ? (
                        <div className="text-center py-12">
                          <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            No mentorship requests yet
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            Request a mentorship to start your learning journey
                          </p>
                          <Button onClick={handleNewRequest}>
                            Request Mentorship
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {mentorshipRequests.map((mentorship) => (
                            <MentorshipRequestCard
                              key={mentorship.id}
                              mentorship={mentorship}
                              onEdit={handleEditClick}
                              onWithdraw={handleWithdrawClick}
                              showEditButton={mentorship.status === MENTORSHIP_STATUS.PENDING}
                              showViewDetailsButton={mentorship.status === MENTORSHIP_STATUS.ACTIVE}
                              showWithdrawButton={mentorship.status === MENTORSHIP_STATUS.PENDING}
                              onViewDetails={() => setActiveTab("active")}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Mentorships</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {requestsLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2 text-muted-foreground">
                              Loading completed mentorships...
                            </p>
                          </div>
                        </div>
                      ) : completedMentorships.length === 0 ? (
                        <div className="text-center py-12">
                          <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">
                            No completed mentorships yet
                          </h3>
                          <p className="text-muted-foreground">
                            Your completed mentorships will appear here
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {completedMentorships.map((mentorship) => (
                            <MentorshipRequestCard
                              key={mentorship.id}
                              mentorship={mentorship}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Drawer for Mentorship Form */}
        <Drawer
          isFlexible={false}
          maxWidth="400px"
          width="400px"
          isOpen={isDrawerOpen}
          onClose={handleFormClose}
          title={
            editingMentorship
              ? "Edit Mentorship Request"
              : "New Mentorship Request"
          }
        >
          <MentorshipRequestForm
            mentorship={editingMentorship}
            onSuccess={handleFormSuccess}
            onClose={handleFormClose}
          />
        </Drawer>

        {/* Confirmation Modal for Withdrawal */}
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setWithdrawingRequest(null);
          }}
          onConfirm={handleConfirmWithdraw}
          title="Withdraw Mentorship Request"
          description="Are you sure you want to withdraw this mentorship request? This action cannot be undone."
          confirmText="Withdraw"
          isLoading={isWithdrawing}
        />
      </div>
    </SidebarLayout>
  );
};

export default MentorshipManagement;