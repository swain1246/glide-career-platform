// Topbar component changes
import { Bell, User, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useState, useEffect } from "react";
import { GetProfileImage } from "@/api/userServices"; 
import { Logout } from "@/api/authService";
import { toast } from "sonner";

export function Topbar({ 
  onMenuClick,
  isMobileMenuOpen = false
}: { 
  onMenuClick?: () => void;
  isMobileMenuOpen?: boolean;
}) {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-primary text-primary-foreground dark:bg-blue-600 dark:text-white";
      case "company": return "bg-accent text-accent-foreground dark:bg-purple-600 dark:text-white";
      case "mentor": return "bg-success text-success-foreground dark:bg-green-600 dark:text-white";
      case "admin": return "bg-warning text-warning-foreground dark:bg-yellow-600 dark:text-white";
      default: return "bg-secondary text-secondary-foreground dark:bg-gray-600 dark:text-white";
    }
  };
  
  // Fetch profile image when user avatar changes
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user?.avatar) {
        setProfileImage(null);
        setImageError(false);
        return;
      }
      
      setImageLoading(true);
      setImageError(false);
      
      try {
        const imageBlob = await GetProfileImage(user.avatar);
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfileImage(imageUrl);
      } catch (error) {
        console.error("Error fetching profile image:", error);
        toast.error("Failed to load profile image");
        setImageError(true);
        setProfileImage(null);
      } finally {
        setImageLoading(false);
      }
    };
    
    fetchProfileImage();
    
    // Cleanup function to revoke object URL
    return () => {
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }
    };
  }, [user?.avatar]);
  
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    
    setIsLoggingOut(true);
    try {
      await Logout(); // Call the logout API
      clearUser();
      navigate("/"); // Navigate to landing page instead of login
      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  if (!user) {
    return null; // Don't render topbar if user is not logged in
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-gray-900/95 dark:border-gray-700">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={onMenuClick}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent dark:text-white">
            CareerGlide
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {user.notificationCount && user.notificationCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {user.notificationCount > 9 ? "9+" : user.notificationCount}
              </Badge>
            )}
          </Button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-border dark:border-gray-600 shadow-sm">
                  {imageLoading ? (
                    <div className="h-full w-full flex items-center justify-center bg-muted dark:bg-gray-800">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <>
                      <AvatarImage 
                        src={profileImage || undefined} 
                        alt={user.name} 
                        className="object-cover"
                        onError={() => setImageError(true)}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground dark:bg-gray-700 dark:text-white font-medium">
                        {imageError ? "👤" : getInitials(user.name)}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-background dark:bg-gray-800 border-border dark:border-gray-700" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-foreground dark:text-white">{user.name}</p>
                  <Badge variant="secondary" className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border dark:bg-gray-700" />
              <DropdownMenuItem className="text-foreground dark:text-gray-200 focus:bg-accent dark:focus:bg-gray-700">
                <User className="mr-2 h-4 w-4" />
                <Link to={`/${user.role}/profile`}>Profile</Link> 
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground dark:text-gray-200 focus:bg-accent dark:focus:bg-gray-700">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border dark:bg-gray-700" />
              <DropdownMenuItem 
                className="text-foreground dark:text-gray-200 focus:bg-accent dark:focus:bg-gray-700"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}