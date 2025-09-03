// src/contexts/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  isAuthenticated: boolean; // Added for easier authentication checks
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Added auth state

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token'); // Check for token
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Also remove token if user data is invalid
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Fixed updateUser function to properly handle initial user creation
  const updateUser = (userData: Partial<UserData>) => {
    setUser(prev => {
      if (prev) {
        // If user exists, merge with new data
        return { ...prev, ...userData };
      } else {
        // If no user exists, create new user object
        // Ensure required fields are present
        if (!userData.role || !userData.name) {
          console.error('Missing required user data: role and name are required');
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
    localStorage.removeItem('token'); // Also remove token on logout
  };

  const refreshNotifications = async () => {
    if (!user || !isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      updateUser({ notificationCount: data.count });
    } catch (error) {
      console.error('Failed to refresh notifications', error);
      // If unauthorized, clear user and redirect to login
      if (error instanceof Error && error.message.includes('401')) {
        clearUser();
      }
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      clearUser, 
      loading,
      refreshNotifications,
      isAuthenticated // Added to context value
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}