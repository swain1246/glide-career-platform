// src/contexts/UserContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { GetUserDetails } from "@/api/userServices";

export type UserRole = "student" | "company" | "mentor" | "admin";

interface UserData {
  role: UserRole;
  name: string;
  avatar?: string | null;
  notificationCount?: number;
  // Add any other user properties you need
}

interface UserContextType {
  user: UserData | null;
  updateUser: (userData: Partial<UserData>) => void;
  clearUser: () => void;
  loading: boolean;
  refreshNotifications?: () => Promise<void>;
  refetchUser: () => Promise<void>;
  isAuthenticated: boolean; // Added for easier authentication checks
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fixed updateUser function to properly handle initial user creation
  const updateUser = (userData: Partial<UserData>) => {
    setUser((prev) => {
      if (prev) {
        // If user exists, merge with new data
        return { ...prev, ...userData };
      } else {
        // If no user exists, create new user object
        // Ensure required fields are present
        if (!userData.role || !userData.name) {
          console.error(
            "Missing required user data: role and name are required"
          );
          return null;
        }
        return userData as UserData;
      }
    });

    // Set authenticated state when updating user
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  //  handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      clearUser();
      window.location.href = "/"; // or "/login"
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  // New method to refetch user details
  const refetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GetUserDetails();

      // Map userTypeId to role
      const roleMap: Record<number, UserRole> = {
        1: "admin",
        2: "company",
        3: "student",
        4: "mentor",
      };

      const userTypeId = response.data.userTypeId;
      const role = roleMap[userTypeId];
      const name = response.data.userName;

      if (!role || !name) {
        throw new Error("Invalid user type or missing name");
      }

      const userData: UserData = {
        role,
        name,
        avatar: response.data.profileImageUrl || null,
        notificationCount: response.data.notificationCount || 0,
      };

      updateUser(userData);
    } catch (error) {
      console.error("Failed to refetch user details:", error);
      // Optionally handle error (e.g., redirect to login)
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        clearUser,
        loading,
        refetchUser,
        isAuthenticated, // Added to context value
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
