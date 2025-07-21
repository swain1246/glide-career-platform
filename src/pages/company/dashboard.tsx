import { useState } from "react";
import { Plus, Eye, Edit, Trash2, Users, Briefcase, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jobs } from "@/data/jobs";
import { companies } from "@/data/companies";
import { applications } from "@/data/applications";
import { notifications } from "@/data/notifications";
import { AnalyticsWidget } from "@/components/AnalyticsWidget";

export default function CompanyDashboard() {
  const [selectedCompany] = useState(companies[0]); // Simulate logged-in company
  
  // Filter data for current company
  const companyJobs = jobs.filter(job => job.companyId === selectedCompany.id);
  const companyApplications = applications.filter(app => 
    companyJobs.some(job => job.id === app.jobId)
  );
  const companyNotifications = notifications.filter(n => n.type === "job_application");

  const analytics = {
    totalJobs: companyJobs.length,
    activeJobs: companyJobs.filter(job => job.status === "active").length,
    totalApplications: companyApplications.length,
    responseRate: Math.round((companyApplications.filter(app => 
      app.status !== "pending").length / companyApplications.length) * 100) || 0
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
      draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Company Dashboard</h1>
            <p className="text-muted-foreground">Manage your job postings and applications</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary-glow">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Company Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedCompany.logo} />
                <AvatarFallback>{selectedCompany.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{selectedCompany.name}</h2>
                <p className="text-muted-foreground">{selectedCompany.industry} • {selectedCompany.location}</p>
                <p className="text-sm text-muted-foreground mt-2">{selectedCompany.description}</p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="text-sm text-muted-foreground">
                    {selectedCompany.employees} employees
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <a href={selectedCompany.website} className="text-sm text-primary hover:underline">
                    {selectedCompany.website}
                  </a>
                </div>
              </div>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <AnalyticsWidget
            title="Total Jobs Posted"
            value={analytics.totalJobs}
            change={{ value: 12, type: "increase", period: "this month" }}
            icon={<Briefcase className="h-4 w-4" />}
            color="blue"
          />
          <AnalyticsWidget
            title="Active Jobs"
            value={analytics.activeJobs}
            change={{ value: 8, type: "increase", period: "this week" }}
            icon={<TrendingUp className="h-4 w-4" />}
            color="green"
          />
          <AnalyticsWidget
            title="Total Applications"
            value={analytics.totalApplications}
            change={{ value: 15, type: "increase", period: "this week" }}
            icon={<Users className="h-4 w-4" />}
            color="purple"
          />
          <AnalyticsWidget
            title="Response Rate"
            value={`${analytics.responseRate}%`}
            change={{ value: 5, type: "increase", period: "vs last month" }}
            icon={<TrendingUp className="h-4 w-4" />}
            color="orange"
          />
        </div>

        {/* Recent Activity & Job Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Badge variant="secondary">{companyNotifications.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyNotifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage src={notification.avatar} /> */}
                      <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
                {companyNotifications.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent applications
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Posted Jobs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Job Postings
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyJobs.slice(0, 5).map((job) => {
                  const jobApplications = companyApplications.filter(app => app.jobId === job.id);
                  
                  return (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.location} • {job.type}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getStatusBadge(job.status)}>
                            {job.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {jobApplications.length} applications
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {/* Posted {formatDate(job.createdAt)} */}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {companyJobs.length === 0 && (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">Start by posting your first job opening</p>
                    <Button className="bg-gradient-to-r from-primary to-primary-glow">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}