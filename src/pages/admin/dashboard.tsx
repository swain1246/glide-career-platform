import { useState } from "react";
import {
  Users,
  Briefcase,
  UserCheck,
  TrendingUp,
  Eye,
  Check,
  X,
  Ban,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { students } from "@/data/students";
import { companies } from "@/data/companies";
import { mentors } from "@/data/mentors";
import { jobs } from "@/data/jobs";
import { applications } from "@/data/applications";
import { AdminUserRow } from "@/components/AdminUserRow";
import { AnalyticsWidget } from "@/components/AnalyticsWidget";
import { SidebarLayout } from "@/layouts/SidebarLayout";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock admin data combining all user types
  const allUsers = [
    ...students.map((s) => ({
      ...s,
      role: "student" as const,
      status: s.id === "1" ? ("pending" as const) : ("approved" as const),
    })),
    ...companies.map((c) => ({
      ...c,
      role: "company" as const,
      status: c.status as "approved" | "pending" | "rejected" | "banned",
      email: `contact@${c.name.toLowerCase().replace(/\s+/g, "")}.com`,
      avatar: c.logo,
      joinedAt: "2024-01-10T00:00:00Z",
    })),
    ...mentors.map((m) => ({
      ...m,
      role: "mentor" as const,
      status: m.id === "1" ? ("pending" as const) : ("approved" as const),
      joinedAt: "2024-01-12T00:00:00Z",
      email: `${m.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    })),
  ];

  // Filter users by status and role
  const pendingUsers = allUsers.filter((user) => user.status === "pending");
  const pendingStudents = pendingUsers.filter(
    (user) => user.role === "student"
  );
  const pendingCompanies = pendingUsers.filter(
    (user) => user.role === "company"
  );
  const pendingMentors = pendingUsers.filter((user) => user.role === "mentor");

  // Analytics data
  const analytics = {
    totalUsers: allUsers.length,
    totalJobs: jobs.length,
    totalApplications: applications.length,
    activeUsers: allUsers.filter((user) => user.status === "approved").length,
    pendingApprovals: pendingUsers.length,
    monthlyGrowth: 15,
    averageApplicationsPerJob: Math.round(applications.length / jobs.length),
    successRate: 78,
  };

  const handleApprove = async (userId: string) => {
    console.log("Approving user:", userId);
    // Handle approval logic
  };

  const handleReject = async (userId: string) => {
    console.log("Rejecting user:", userId);
    // Handle rejection logic
  };

  const handleBan = async (userId: string) => {
    console.log("Banning user:", userId);
    // Handle ban logic
  };

  const handleView = (userId: string) => {
    console.log("Viewing user profile:", userId);
    // Handle view profile logic
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users, monitor platform activity, and oversee operations
              </p>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="approvals" className="relative">
                Approvals
                {pendingUsers.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {pendingUsers.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AnalyticsWidget
                  title="Total Users"
                  value={analytics.totalUsers}
                  change={{
                    value: analytics.monthlyGrowth,
                    type: "increase",
                    period: "this month",
                  }}
                  icon={<Users className="h-4 w-4" />}
                  color="blue"
                />
                <AnalyticsWidget
                  title="Active Jobs"
                  value={analytics.totalJobs}
                  change={{ value: 8, type: "increase", period: "this week" }}
                  icon={<Briefcase className="h-4 w-4" />}
                  color="green"
                />
                <AnalyticsWidget
                  title="Total Applications"
                  value={analytics.totalApplications}
                  change={{ value: 22, type: "increase", period: "this week" }}
                  icon={<TrendingUp className="h-4 w-4" />}
                  color="purple"
                />
                <AnalyticsWidget
                  title="Pending Approvals"
                  value={analytics.pendingApprovals}
                  change={{
                    value: -12,
                    type: "decrease",
                    period: "vs yesterday",
                  }}
                  icon={<UserCheck className="h-4 w-4" />}
                  color="orange"
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">
                          New student registration: Alex Johnson
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          2m ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-foreground">
                          TechCorp posted a new job
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          15m ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-foreground">
                          Mentor Dr. Sarah Chen approved
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          1h ago
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-foreground">
                          50 new applications this week
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          2h ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Students
                        </span>
                        <span className="font-semibold text-foreground">
                          {students.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Companies
                        </span>
                        <span className="font-semibold text-foreground">
                          {companies.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Mentors
                        </span>
                        <span className="font-semibold text-foreground">
                          {mentors.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Success Rate
                        </span>
                        <span className="font-semibold text-green-600">
                          {analytics.successRate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Approvals Tab */}
            <TabsContent value="approvals" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pending Students
                      <Badge variant="secondary">
                        {pendingStudents.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingStudents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending students
                      </p>
                    ) : (
                      pendingStudents.map((student) => (
                        <AdminUserRow
                          key={student.id}
                          user={student}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onBan={handleBan}
                          onView={handleView}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Pending Companies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pending Companies
                      <Badge variant="secondary">
                        {pendingCompanies.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingCompanies.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending companies
                      </p>
                    ) : (
                      pendingCompanies.map((company) => (
                        <AdminUserRow
                          key={company.id}
                          user={company}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onBan={handleBan}
                          onView={handleView}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Pending Mentors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Pending Mentors
                      <Badge variant="secondary">{pendingMentors.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingMentors.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No pending mentors
                      </p>
                    ) : (
                      pendingMentors.map((mentor) => (
                        <AdminUserRow
                          key={mentor.id}
                          user={mentor}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onBan={handleBan}
                          onView={handleView}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User Management Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.slice(0, 10).map((user) => (
                        <AdminUserRow
                          key={user.id}
                          user={user}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onBan={handleBan}
                          onView={handleView}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsWidget
                  title="Monthly Active Users"
                  value={245}
                  change={{
                    value: 12,
                    type: "increase",
                    period: "vs last month",
                  }}
                  icon={<Users className="h-4 w-4" />}
                  color="blue"
                />
                <AnalyticsWidget
                  title="Job Completion Rate"
                  value="82%"
                  change={{ value: 5, type: "increase", period: "this month" }}
                  icon={<TrendingUp className="h-4 w-4" />}
                  color="green"
                />
                <AnalyticsWidget
                  title="Average Session Time"
                  value="24m"
                  change={{ value: 3, type: "increase", period: "this week" }}
                  icon={<Eye className="h-4 w-4" />}
                  color="purple"
                />
                <AnalyticsWidget
                  title="Platform Revenue"
                  value="$12,450"
                  change={{ value: 18, type: "increase", period: "this month" }}
                  icon={<TrendingUp className="h-4 w-4" />}
                  color="orange"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <p>Chart placeholder - User growth over time</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Application Success Rates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <p>Chart placeholder - Application success metrics</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
}
