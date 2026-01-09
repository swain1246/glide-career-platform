import { useEffect, useState } from "react";
import {
  TrendingUp,
  Briefcase,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Target,
} from "lucide-react";
import { SidebarLayout } from "../../layouts/SidebarLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { JobCard } from "../../components/JobCard";
import { ProfileCard } from "../../components/ProfileCard";
import { jobs } from "../../data/jobs";
import { students } from "../../data/students";
import { applications } from "../../data/applications";
import { mentorInvites } from "../../data/mentors";
import { notifications } from "../../data/notifications";
import { getStudentDashboardData } from "@/api/studentServices";
import { useUser } from "@/contexts/UserContext";

// Define interfaces for the API response
interface QuickStats {
  TotalApplications: number;
  ProfileViews: number;
  MentorInvitations: number;
  ResponseRate: string;
}

interface ProfileStrength {
  ProfileStrength: number;
  BasicDetailsComplete: boolean;
  ResumeUploaded: boolean;
  StudentCertificationsPresent: boolean;
  StudentEducationPresent: boolean;
  StudentInternshipsPresent: boolean;
  StudentProjectsPresent: boolean;
}

interface MentorInvitation {
  InvitationId: number;
  MentorId: number;
  Title: string;
  MentorName: string;
  ProfileUrl: string;
  Description: string;
  MentorMessage: string;
}

interface DashboardData {
  QuickStats: QuickStats;
  RecentApplications: any[];
  ProfileStrength: ProfileStrength;
  RecomendedJob: any[];
  MentorInvitation: MentorInvitation[];
}

const StudentDashboard = () => {
  // Mock current user - in real app this would come from auth context
  const {user} = useUser()
  const currentStudent = students[0]; // Alex Chen
  const userApplications = applications.filter(
    (app) => app.studentId === currentStudent.id
  );
  const userNotifications = notifications.filter(
    (notif) => notif.userId === currentStudent.id && !notif.isRead
  );
  const recommendedJobs = jobs
    .filter((job) =>
      job.skills.some((skill) => currentStudent.skills.includes(skill))
    )
    .slice(0, 3);

  // State for API data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getStudentDashboardData();

        if (response.success) {
          // Parse the JSON string in the data field
          const parsedData: DashboardData = JSON.parse(response.data);
          setDashboardData(parsedData);
          console.log(parsedData);
        } else {
          setError(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard data");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Applications Sent",
      value:
        dashboardData?.QuickStats?.TotalApplications ?? userApplications.length,
      icon: <Briefcase className="h-5 w-5" />,
      trend: "+2 this week",
      color: "text-primary",
    },
    {
      title: "Profile Views",
      value: dashboardData?.QuickStats?.ProfileViews ?? 47,
      icon: <Users className="h-5 w-5" />,
      trend: "+12 this week",
      color: "text-success",
    },
    {
      title: "Skill Score",
      value: dashboardData?.QuickStats?.ResponseRate ?? "85%",
      icon: <Star className="h-5 w-5" />,
      trend: "+5% this month",
      color: "text-warning",
    },
    {
      title: "Mentor Invitations",
      value:
        dashboardData?.QuickStats?.MentorInvitations ?? mentorInvites.length,
      icon: <TrendingUp className="h-5 w-5" />,
      trend: "Above average",
      color: "text-accent",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "interview":
        return "text-orange-600";
      case "reviewing":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "interview":
        return <Calendar className="h-4 w-4" />;
      case "reviewing":
        return <Clock className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // Use API data for applications if available, otherwise fallback to mock data
  const displayApplications = dashboardData?.RecentApplications.length
    ? dashboardData.RecentApplications
    : userApplications.slice(0, 3);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg font-medium">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (error) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-destructive/10 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-destructive mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your career journey today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-card-hover transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Recent Applications</span>
                </CardTitle>
                <CardDescription>
                  Track the status of your job applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userApplications.slice(0, 3).map((application) => {
                    const job = jobs.find((j) => j.id === application.jobId);
                    if (!job) return null;

                    return (
                      <div
                        key={application.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={job.companyLogo}
                              alt={job.companyName}
                            />
                            <AvatarFallback>
                              {job.companyName.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {job.companyName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`flex items-center space-x-1 ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {getStatusIcon(application.status)}
                            <span className="text-sm font-medium capitalize">
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button variant="outline" className="w-full">
                    View All Applications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Recommended for You</span>
                </CardTitle>
                <CardDescription>
                  Jobs that match your skills and interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {recommendedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onApply={(jobId) => console.log("Apply to job:", jobId)}
                      onViewDetails={(jobId) =>
                        console.log("View job details:", jobId)
                      }
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Strength</CardTitle>
                <CardDescription>
                  Complete your profile to attract more opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span className="font-medium">
                      {dashboardData?.ProfileStrength.ProfileStrength}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full"
                      style={{
                        width: `${dashboardData?.ProfileStrength.ProfileStrength}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength?.BasicDetailsComplete ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Basic information</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Skills added</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength?.ResumeUploaded ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Resume uploaded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength?.StudentEducationPresent ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Add Education</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength
                      ?.StudentInternshipsPresent ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Add Intership</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength
                      ?.StudentCertificationsPresent ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Add Certification</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {dashboardData?.ProfileStrength?.StudentProjectsPresent ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-red-600" />
                    )}
                    <span>Add projects</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userNotifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Browse New Jobs
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Find Mentors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Take Skill Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default StudentDashboard;
