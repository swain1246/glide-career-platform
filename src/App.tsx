import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/login";
import Register from "./pages/register";
import JobsPage from "./pages/jobs/index";
import StudentDashboard from "./pages/student/dashboard";
import NotFound from "./pages/NotFound";
import CompanyDashboard from "./pages/company/dashboard";
import PostJob from "./pages/company/post-job";
import AdminDashboard from "./pages/admin/dashboard";
import EditProfile from "./pages/student/edit-profile";
import MentorDashboard from "./pages/mentor/dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/edit-profile" element={<EditProfile />} />
          <Route path="/company/dashboard" element={<CompanyDashboard/>}/>
          <Route path="/company/postjob" element={<PostJob/>}/>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
