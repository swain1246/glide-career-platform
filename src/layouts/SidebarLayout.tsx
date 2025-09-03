import { ReactNode, useState } from "react";
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
  Shield,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
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
import { useLocation, Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useUser } from "../contexts/UserContext";
import { UserRole } from "../contexts/UserContext";

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

// AppSidebar component changes
function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { user } = useUser();
  const navigation = user ? navigationConfig[user.role] : [];
  const collapsed = state === "collapsed";
  
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "student": return "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white";
      case "company": return "bg-accent text-accent-foreground dark:bg-purple-600 dark:text-white";
      case "mentor": return "bg-success text-success-foreground dark:bg-green-600 dark:text-white";
      case "admin": return "bg-warning text-warning-foreground dark:bg-yellow-600 dark:text-white";
      default: return "bg-secondary text-secondary-foreground dark:bg-gray-600 dark:text-white";
    }
  };
  
  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };
  
  if (!user) {
    return null; // Don't render sidebar if user is not logged in
  }
  
  return (
    <Sidebar className={cn("transition-all duration-300 bg-background dark:bg-gray-900 border-r border-border dark:border-gray-700", collapsed ? "w-20" : "w-64")} collapsible="icon">
      <SidebarContent className="bg-background dark:bg-gray-900">
        {/* Logo/Brand - Adjusted height and padding to match topbar */}
        <div className="h-16 border-b border-border dark:border-gray-700 flex items-center justify-between px-4">
          {!collapsed ? (
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent dark:text-white">
                CareerGlide
              </div>
              <Badge variant="secondary" className={getRoleColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
          ) : (
            <div className="text-xl font-bold text-center text-primary dark:text-white">
              CG
            </div>
          )}
          
          {/* Collapse button for desktop */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center p-2 rounded-md bg-muted hover:bg-accent transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? 
              <ChevronRight className="h-5 w-5 text-foreground dark:text-gray-300" /> : 
              <ChevronLeft className="h-5 w-5 text-foreground dark:text-gray-300" />
            }
          </button>
        </div>
        
        {/* Navigation Groups */}
        {navigation.map((group, index) => (
          <SidebarGroup key={index}>
            {!collapsed && (
              <SidebarGroupLabel className="text-muted-foreground dark:text-gray-400">{group.label}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <Link 
                        to={item.url} 
                        className={cn(
                          "flex items-center space-x-3 hover:bg-muted rounded-md transition-colors dark:hover:bg-gray-800",
                          isActive(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium dark:bg-gray-800 dark:text-white' : ''
                        )}
                      >
                        <item.icon className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        {!collapsed && <span className="text-foreground dark:text-gray-200">{item.title}</span>}
                      </Link>
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

// SidebarLayout component changes
interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { user, loading } = useUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-card dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground dark:text-white mb-4">
            Authentication Required
          </h1>
          <p className="text-muted-foreground dark:text-gray-400 mb-6">
            Please log in to access this page.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  const navigation = navigationConfig[user.role];
  
  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        {/* Mobile sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background dark:bg-gray-900 border-r border-border dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile sidebar header - Adjusted height and padding to match topbar */}
          <div className="h-16 border-b border-border dark:border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent dark:text-white">
                CareerGlide
              </div>
              <Badge variant="secondary" className="bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-muted dark:hover:bg-gray-800"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-foreground dark:text-gray-300" />
            </button>
          </div>
          
          {/* Mobile navigation */}
          <div className="p-4">
            {navigation.map((group, index) => (
              <div key={index} className="mb-6">
                <div className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-2">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-colors dark:hover:bg-gray-800",
                        isActive(item.url) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium dark:bg-gray-800 dark:text-white' : ''
                      )}
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                      <span className="text-foreground dark:text-gray-200">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop sidebar */}
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <Topbar 
            // userRole={user.role}
            // userName={user.name}
            // userAvatar={user.avatar}
            // notificationCount={user.notificationCount || 0}
            onMenuClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            isMobileMenuOpen={isMobileSidebarOpen}
          />
          <main className="flex-1 p-6 overflow-auto bg-background dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}