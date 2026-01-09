import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Edit3,
  Users,
  BookOpen,
  Calendar,
  Search,
  MoreHorizontal,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  TrendingUp,
  Target,
  Activity,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { SidebarLayout } from "@/layouts/SidebarLayout";

// TypeScript Interfaces
interface Program {
  id: string;
  title: string;
  domain: string;
  stack: string;
  type: "Skill" | "Project";
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "upcoming";
  description: string;
  mentorCount: number;
  studentCount: number;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "mentor" | "student";
  status: "active" | "inactive" | "pending";
  joinedDate: string;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "not_started" | "in_progress" | "completed";
  assignedTo?: string;
}

interface AnalyticsData {
  requests: { name: string; requests: number; accepted: number }[];
  completion: { name: string; value: number; color: string }[];
  engagement: { name: string; value: number }[];
}

// Static program data
const programData: Program = {
  id: "1",
  title: "Full Stack Web Development Mentorship",
  domain: "Technology",
  stack: "React, Node.js, MongoDB",
  type: "Skill",
  startDate: "2024-01-15",
  endDate: "2024-06-15",
  status: "active",
  description:
    "A comprehensive 6-month mentorship program designed to guide aspiring developers through modern web development practices, including frontend frameworks, backend APIs, and database management.",
  mentorCount: 8,
  studentCount: 24,
};

const participantsData: Participant[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "/api/placeholder/32/32",
    role: "mentor",
    status: "active",
    joinedDate: "2024-01-10",
  },
  {
    id: "2",
    name: "David Rodriguez",
    email: "david.r@example.com",
    avatar: "/api/placeholder/32/32",
    role: "mentor",
    status: "active",
    joinedDate: "2024-01-12",
  },
  {
    id: "3",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    avatar: "/api/placeholder/32/32",
    role: "student",
    status: "active",
    joinedDate: "2024-01-15",
  },
  {
    id: "4",
    name: "Michael Wang",
    email: "michael.w@example.com",
    avatar: "/api/placeholder/32/32",
    role: "student",
    status: "active",
    joinedDate: "2024-01-16",
  },
  {
    id: "5",
    name: "Jessica Miller",
    email: "jessica.m@example.com",
    avatar: "/api/placeholder/32/32",
    role: "student",
    status: "pending",
    joinedDate: "2024-01-20",
  },
  {
    id: "6",
    name: "Alex Thompson",
    email: "alex.t@example.com",
    avatar: "/api/placeholder/32/32",
    role: "student",
    status: "active",
    joinedDate: "2024-01-22",
  },
  {
    id: "7",
    name: "Lisa Park",
    email: "lisa.p@example.com",
    avatar: "/api/placeholder/32/32",
    role: "student",
    status: "inactive",
    joinedDate: "2024-01-25",
  },
];

const tasksData: Task[] = [
  {
    id: "1",
    title: "Setup Development Environment",
    dueDate: "2024-02-01",
    status: "completed",
  },
  {
    id: "2",
    title: "Build First React Component",
    dueDate: "2024-02-15",
    status: "in_progress",
  },
  {
    id: "3",
    title: "Create REST API Endpoints",
    dueDate: "2024-03-01",
    status: "not_started",
  },
];

const analyticsData: AnalyticsData = {
  requests: [
    { name: "Jan", requests: 45, accepted: 38 },
    { name: "Feb", requests: 52, accepted: 44 },
    { name: "Mar", requests: 38, accepted: 35 },
    { name: "Apr", requests: 61, accepted: 52 },
  ],
  completion: [
    { name: "Completed", value: 65, color: "#10b981" },
    { name: "In Progress", value: 25, color: "#f59e0b" },
    { name: "Not Started", value: 10, color: "#6b7280" },
  ],
  engagement: [
    { name: "Week 1", value: 20 },
    { name: "Week 2", value: 35 },
    { name: "Week 3", value: 45 },
    { name: "Week 4", value: 52 },
    { name: "Week 5", value: 48 },
    { name: "Week 6", value: 61 },
  ],
};

const AdminProgramView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [participantFilter, setParticipantFilter] = useState<
    "all" | "mentors" | "students"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isExporting, setIsExporting] = useState(false);

  // Handlers
  const handleEdit = () => console.log("Edit program");
  const handleExport = () => console.log("Export data");
  const handleBack = () => navigate("/admin/MentorshipManagement");
  const handleViewProfile = (id: string) => console.log("View profile:", id);
  const handleMessage = (id: string) => console.log("Message participant:", id);
  const handleAddTask = () => console.log("Add new task");
  const handleMarkComplete = (taskId: string) =>
    console.log("Mark task complete:", taskId);

  // Filter participants
  const filteredParticipants = participantsData.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      participantFilter === "all" ||
      (participantFilter === "mentors" && participant.role === "mentor") ||
      (participantFilter === "students" && participant.role === "student");
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = filteredParticipants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "upcoming":
        return <Badge variant="outline">Upcoming</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "in_progress":
        return <Badge variant="outline">In Progress</Badge>;
      case "not_started":
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type badge with appropriate color
  const getTypeBadge = (type: "Skill" | "Project") => {
    return type === "Skill" ? (
      <Badge className="bg-blue-100 text-blue-800">Skill</Badge>
    ) : (
      <Badge className="bg-purple-100 text-purple-800">Project</Badge>
    );
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header with Breadcrumb */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center text-sm text-muted-foreground">
                <button
                  onClick={handleBack}
                  className="flex items-center hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Programs
                </button>
                <span className="mx-2">/</span>
                <span className="text-foreground">View</span>
              </div>

              {/* Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {programData.title}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Program details and management
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={handleEdit}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Program
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Program Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Program Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Domain
                  </label>
                  <p className="text-lg font-semibold">{programData.domain}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tech Stack
                  </label>
                  <p className="text-lg font-semibold">{programData.stack}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Type
                  </label>
                  <div className="mt-1">{getTypeBadge(programData.type)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(programData.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </label>
                  <p className="text-lg font-semibold">
                    {new Date(programData.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    End Date
                  </label>
                  <p className="text-lg font-semibold">
                    {new Date(programData.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="mt-2 text-foreground leading-relaxed">
                  {programData.description}
                </p>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Mentors:</span>
                  <span className="font-semibold text-foreground">
                    {programData.mentorCount}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Students:</span>
                  <span className="font-semibold text-foreground">
                    {programData.studentCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="tasks">Tasks & Milestones</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-chart-1" />
                      <span className="text-2xl font-bold">42</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Completed Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-chart-2" />
                      <span className="text-2xl font-bold">156</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Average Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-chart-3" />
                      <span className="text-2xl font-bold">4.8</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on 24 reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Program Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-foreground leading-relaxed">
                      {programData.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="font-medium mb-2">
                          Key Learning Objectives
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Master modern React development patterns</li>
                          <li>• Build scalable Node.js backend services</li>
                          <li>• Design and implement MongoDB databases</li>
                          <li>• Deploy applications to cloud platforms</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Program Benefits</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 1-on-1 mentoring sessions</li>
                          <li>• Real-world project experience</li>
                          <li>• Industry best practices</li>
                          <li>• Career guidance and support</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Participants</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search participants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full sm:w-64"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={
                            participantFilter === "all" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setParticipantFilter("all")}
                        >
                          All
                        </Button>
                        <Button
                          variant={
                            participantFilter === "mentors"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setParticipantFilter("mentors")}
                        >
                          Mentors
                        </Button>
                        <Button
                          variant={
                            participantFilter === "students"
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setParticipantFilter("students")}
                        >
                          Students
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={participant.avatar}
                                  alt={participant.name}
                                />
                                <AvatarFallback>
                                  {participant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {participant.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {participant.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                participant.role === "mentor"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {participant.role.charAt(0).toUpperCase() +
                                participant.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(participant.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              participant.joinedDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleViewProfile(participant.id)
                                }
                              >
                                View Profile
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMessage(participant.id)}
                              >
                                <MessageSquare className="w-4 h-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-4 md:space-y-0">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredParticipants.length)}{" "}
                      of {filteredParticipants.length} participants
                    </div>

                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          Items per page:
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) =>
                            setItemsPerPage(Number(e.target.value))
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <CardTitle>Tasks & Milestones</CardTitle>
                    <Button onClick={handleAddTask}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasksData.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            {task.status === "completed" && (
                              <CheckCircle className="w-5 h-5 text-chart-2" />
                            )}
                            {task.status === "in_progress" && (
                              <Clock className="w-5 h-5 text-chart-3" />
                            )}
                            {task.status === "not_started" && (
                              <AlertCircle className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(task.status)}
                          {task.status !== "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkComplete(task.id)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Requests vs Accepted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.requests}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="requests" fill="#3b82f6" />
                        <Bar dataKey="accepted" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Task Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analyticsData.completion}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {analyticsData.completion.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Engagement Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analyticsData.engagement}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default AdminProgramView;
