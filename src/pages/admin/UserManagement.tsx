import React, { useState, useEffect } from "react";
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
import ProfileModal from "./userManagement/ProfileModal";
import { GetUsersList } from "@/api/admin/UserManagement";
import { GetProfileImage } from "@/api/userServices";

// User type mapping
const USER_TYPES = {
  ALL: 0,
  ADMIN: 1,
  COMPANY: 2,
  STUDENT: 3,
  MENTOR: 4,
};

// User type names
const USER_TYPE_NAMES = {
  0: "all",
  1: "admin",
  2: "company",
  3: "student",
  4: "mentor",
};

// User type display names
const USER_TYPE_DISPLAY_NAMES = {
  0: "All User Types",
  1: "Admins",
  2: "Companies",
  3: "Students",
  4: "Mentors",
};

// User type badge colors
const USER_TYPE_BADGE_COLORS = {
  1: "bg-purple-100 text-purple-800", // admin
  2: "bg-gray-100 text-gray-800",   // company
  3: "bg-blue-100 text-blue-800",    // student
  4: "bg-green-100 text-green-800",  // mentor
};

// Gender badge colors
const GENDER_BADGE_COLORS = {
  Male: "bg-blue-100 text-blue-800",
  Female: "bg-pink-100 text-pink-800",
  Other: "bg-purple-100 text-purple-800",
};

// User type from API - updated to match camelCase response
interface UserFromAPI {
  userId: number;
  userTypeId: number;
  profileImageUrl: string | null;
  name: string;
  institute_Company: string;
  gender: string;
  email: string | null;
  totalUsers?: number; // Optional, only in first record
}

// Converted User type for frontend
interface User {
  id: string;
  name: string;
  email: string;
  userType: "student" | "mentor" | "admin" | "company";
  institution: string;
  profileImage?: string;
  profileImageUrl?: string;
  userTypeId: number; // Added to store the actual user type ID
  gender: string; // Added gender field
}

// Convert API user to frontend user
const convertUserFromAPI = (apiUser: UserFromAPI): User => {
  return {
    id: apiUser.userId.toString(),
    name: apiUser.name,
    email: apiUser.email || "N/A", // Handle null email
    userType: USER_TYPE_NAMES[apiUser.userTypeId as keyof typeof USER_TYPE_NAMES] as "student" | "mentor" | "admin" | "company",
    institution: apiUser.institute_Company,
    profileImageUrl: apiUser.profileImageUrl || undefined,
    userTypeId: apiUser.userTypeId, // Store the actual user type ID
    gender: apiUser.gender || "Not specified", // Handle null gender
  };
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0); // State to store total users count
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("0"); // Default to "all" (0)
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [profileImages, setProfileImages] = useState<Record<string, string>>({});

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: usersPerPage,
        userType: parseInt(userTypeFilter, 10),
      };
      
      console.log("Fetching users with params:", params);
      
      const response = await GetUsersList(params);
      console.log("API Response:", response);
      
      if (response.success && response.data) {
        const apiUsers = response.data as UserFromAPI[];
        
        // Extract totalUsers from the first record if available
        if (apiUsers.length > 0 && apiUsers[0].totalUsers) {
          setTotalUsers(apiUsers[0].totalUsers);
          console.log("Total users from API:", apiUsers[0].totalUsers);
        } else {
          setTotalUsers(0);
        }
        
        const convertedUsers = apiUsers.map(convertUserFromAPI);
        console.log("Converted users:", convertedUsers);
        setUsers(convertedUsers);
        
        // Fetch profile images for each user
        apiUsers.forEach(async (user) => {
          if (user.profileImageUrl) {
            try {
              const imageBlob = await GetProfileImage(user.profileImageUrl);
              const imageUrl = URL.createObjectURL(imageBlob);
              setProfileImages(prev => ({
                ...prev,
                [user.userId.toString()]: imageUrl
              }));
            } catch (error) {
              console.error(`Error fetching profile image for user ${user.userId}:`, error);
            }
          }
        });
      } else {
        console.error("API response unsuccessful:", response);
        setError(response.message || "Failed to fetch users");
        setTotalUsers(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred while fetching users");
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when component mounts or when filters/pagination change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, usersPerPage, userTypeFilter]);

  // Filter users based on search term (client-side filtering)
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Pagination - using totalUsers from API
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users; // Use the users directly from API, not filteredUsers
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  // Handle view profile action
  const handleViewProfile = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log("Changing to page:", page);
    setCurrentPage(page);
    // The useEffect will trigger fetchUsers with the new page number
  };

  // Handle users per page change
  const handleUsersPerPageChange = (value: string) => {
    const newUsersPerPage = parseInt(value, 10);
    setUsersPerPage(newUsersPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle user type filter change
  const handleUserTypeFilterChange = (value: string) => {
    setUserTypeFilter(value);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  // Get user type badge color
  const getUserTypeBadge = (userTypeId: number) => {
    const colorClass = USER_TYPE_BADGE_COLORS[userTypeId as keyof typeof USER_TYPE_BADGE_COLORS];
    const userTypeName = USER_TYPE_NAMES[userTypeId as keyof typeof USER_TYPE_NAMES];
    
    return (
      <Badge className={colorClass}>
        {userTypeName.charAt(0).toUpperCase() + userTypeName.slice(1)}
      </Badge>
    );
  };

  // Get gender badge color
  const getGenderBadge = (gender: string) => {
    const colorClass = GENDER_BADGE_COLORS[gender as keyof typeof GENDER_BADGE_COLORS] || GENDER_BADGE_COLORS.Other;
    
    return (
      <Badge className={colorClass}>
        {gender}
      </Badge>
    );
  };

  // Get institution icon
  const getInstitutionIcon = (userType: string) => {
    switch (userType) {
      case "student":
        return <GraduationCap className="h-4 w-4" />;
      case "mentor":
        return <Briefcase className="h-4 w-4" />;
      case "admin":
        return <User className="h-4 w-4" />;
      case "company":
        return <Building className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  return (
    <>
      <SidebarLayout>
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage all users in the system ({totalUsers} total users)
              </p>
            </div>

            {/* Search and Filters */}
            <Card className="mb-6">
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Select value={userTypeFilter} onValueChange={handleUserTypeFilterChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by user type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(USER_TYPE_DISPLAY_NAMES).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  <p className="mt-2 text-muted-foreground">Loading users...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="mb-6">
                <CardContent className="p-6 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchUsers} variant="outline">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* User List - Desktop View (Table) */}
            {!loading && !error && (
              <>
                <Card className="hidden md:block mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Users List</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              User
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              Type
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              Institution
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              Email
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              Gender
                            </th>
                            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage 
                                      src={profileImages[user.id] || user.profileImageUrl} 
                                      alt={user.name} 
                                    />
                                    <AvatarFallback>
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      ID: {user.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {getUserTypeBadge(user.userTypeId)}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  {getInstitutionIcon(user.userType)}
                                  <span className="ml-2">{user.institution}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                                  <span>{user.email}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {getGenderBadge(user.gender)}
                              </td>
                              <td className="py-3 px-4">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Profile
                                    </DropdownMenuItem>
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

                {/* User List - Mobile View (Cards) */}
                <div className="md:hidden space-y-4">
                  {currentUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-3">
                              <AvatarImage 
                                src={profileImages[user.id] || user.profileImageUrl} 
                                alt={user.name} 
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProfile(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getUserTypeBadge(user.userTypeId)}
                          {getGenderBadge(user.gender)}
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          {getInstitutionIcon(user.userType)}
                          <span className="ml-2">{user.institution}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 space-y-4 md:space-y-0">
                  <div className="text-sm text-muted-foreground">
                    Showing {indexOfFirstUser + 1} to{" "}
                    {Math.min(indexOfLastUser, totalUsers)} of{" "}
                    {totalUsers} users
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Users per page:</span>
                      <Select 
                        value={usersPerPage.toString()} 
                        onValueChange={handleUsersPerPageChange}
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
              </>
            )}
          </div>
        </div>
      </SidebarLayout>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedUserId}
      />
    </>
  );
};

export default UserManagement;