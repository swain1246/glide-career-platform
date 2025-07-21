import { ReactNode } from "react";
import { 
  Home, 
  Briefcase, 
  Users, 
  User, 
  Settings, 
  PlusCircle,
  FileText,
  BookOpen,
  Star,
  BarChart3,
  Shield
} from "lucide-react";
import { Topbar } from "../components/Topbar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../components/ui/sidebar";
import { Badge } from "../components/ui/badge";

interface SidebarLayoutProps {
  children: ReactNode;
  userRole: "student" | "company" | "mentor" | "admin";
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const navigationConfig = {
  student: [
    {
      label: "Main",
      items: [
        { title: "Dashboard", url: "/student/dashboard", icon: Home },
        { title: "Browse Jobs", url: "/jobs", icon: Briefcase },
        { title: "My Applications", url: "/student/applications", icon: FileText },
        { title: "Find Mentors", url: "/student/mentors", icon: Users },
      ]
    },
    {
      label: "Profile",
      items: [
        { title: "Edit Profile", url: "/student/edit-profile", icon: User },
        { title: "Skills & Resume", url: "/student/skills", icon: BookOpen },
        { title: "Settings", url: "/student/settings", icon: Settings },
      ]
    }
  ],
  company: [
    {
      label: "Main",
      items: [
        { title: "Dashboard", url: "/company/dashboard", icon: Home },
        { title: "Post New Job", url: "/company/post-job", icon: PlusCircle },
        { title: "Manage Jobs", url: "/company/jobs", icon: Briefcase },
        { title: "Talent Pool", url: "/company/talent", icon: Users },
      ]
    },
    {
      label: "Account",
      items: [
        { title: "Company Profile", url: "/company/profile", icon: User },
        { title: "Analytics", url: "/company/analytics", icon: BarChart3 },
        { title: "Settings", url: "/company/settings", icon: Settings },
      ]
    }
  ],
  mentor: [
    {
      label: "Main",
      items: [
        { title: "Dashboard", url: "/mentor/dashboard", icon: Home },
        { title: "Find Students", url: "/mentor/students", icon: Users },
        { title: "My Mentees", url: "/mentor/mentees", icon: BookOpen },
        { title: "Sessions", url: "/mentor/sessions", icon: Star },
      ]
    },
    {
      label: "Account",
      items: [
        { title: "Profile", url: "/mentor/profile", icon: User },
        { title: "Availability", url: "/mentor/availability", icon: Settings },
      ]
    }
  ],
  admin: [
    {
      label: "Management",
      items: [
        { title: "Dashboard", url: "/admin/dashboard", icon: Home },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Companies", url: "/admin/companies", icon: Briefcase },
        { title: "Mentors", url: "/admin/mentors", icon: Star },
      ]
    },
    {
      label: "System",
      items: [
        { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
        { title: "Security", url: "/admin/security", icon: Shield },
        { title: "Settings", url: "/admin/settings", icon: Settings },
      ]
    }
  ]
};

function AppSidebar({ userRole }: { userRole: "student" | "company" | "mentor" | "admin" }) {
  const { state } = useSidebar();
  const navigation = navigationConfig[userRole];
  const collapsed = state === "collapsed";

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-primary text-primary-foreground";
      case "company": return "bg-accent text-accent-foreground";
      case "mentor": return "bg-success text-success-foreground";
      case "admin": return "bg-warning text-warning-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Logo/Brand */}
        <div className="p-4 border-b">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CareerGlide
              </div>
              <Badge variant="secondary" className={getRoleColor(userRole)}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
            </div>
          ) : (
            <div className="text-xl font-bold text-center text-primary">
              CG
            </div>
          )}
        </div>

        {/* Navigation Groups */}
        {navigation.map((group, index) => (
          <SidebarGroup key={index}>
            {!collapsed && (
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.url} 
                        className="flex items-center space-x-3 hover:bg-muted rounded-md transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}

export function SidebarLayout({ 
  children, 
  userRole, 
  userName = "John Doe", 
  userAvatar,
  notificationCount = 0 
}: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar userRole={userRole} />
        <div className="flex-1 flex flex-col">
          <Topbar 
            userRole={userRole}
            userName={userName}
            userAvatar={userAvatar}
            notificationCount={notificationCount}
          />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}