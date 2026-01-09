// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/ForgotPassword";
import JobsPage from "./pages/jobs/index";
import StudentDashboard from "./pages/student/dashboard";
import NotFound from "./pages/NotFound";
import CompanyDashboard from "./pages/company/dashboard";
import PostJob from "./pages/company/post-job";
import AdminDashboard from "./pages/admin/dashboard";
import StudentProfilePage from "./pages/student/StudentProfile";
import MentorDashboard from "./pages/mentor/dashboard";
import MentorProfilePage from "./pages/mentor/menterProfile";
import Unauthorized from "./pages/Unauthorized";
import { UserProvider } from "./contexts/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import UserSettings from "./pages/UserSettings";
import MentorshipManagement from "./pages/student/MentorshipManagement";
import MentorMentorshiPManagement from "./pages/mentor/MentorMentorshipManagement";
import AdminMentorshipManagement from "./pages/admin/AdminMentorshipManagement";
import MentorshipRequestManagement from "./pages/admin/MentorshipRequestManagement";
import AdminProgramView from "./pages/admin/mentorshipProgram/AdminProgramView";

const queryClient = new QueryClient();

// Create a wrapper component that uses useNavigate
const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/userSetting" element={<UserSettings />} />
      <Route
        path="/mentor/MentorshipManagement"
        element={<MentorMentorshiPManagement />}
      />
      <Route
        path="/admin/MentorshipManagement"
        element={<AdminMentorshipManagement />}
      />
      <Route
        path="/admin/ProgramView/:id"
        element={<AdminProgramView />}
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/MentorshipManagement"
        element={
          <ProtectedRoute requiredRole="student">
            <MentorshipManagement />
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/postjob"
        element={
          <ProtectedRoute requiredRole="company">
            <PostJob />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/userManagement"
        element={
          <ProtectedRoute requiredRole="admin">
            <UserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/MentorshipRequest"
        element={
          <ProtectedRoute requiredRole="admin">
            <MentorshipRequestManagement />
          </ProtectedRoute>
        }
      />

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor/profile"
        element={
          <ProtectedRoute requiredRole="mentor">
            <MentorProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
