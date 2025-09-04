import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { useUser } from "../contexts/UserContext";
import { loginUser } from "../api/authService";
import { LoginRequest } from "../types/auth.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UserRole = "student" | "company" | "mentor" | "admin";

interface UserData {
  role: UserRole;
  name: string;
  avatar?: string | null;
  notificationCount?: number;
  // Add any other user properties you need
}

const LoginPage = () => {
  const { updateUser } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: LoginRequest = { email, password };

    try {
      const response = await loginUser(payload);

      // Determine user role and name based on userTypeId
      const roleMap: Record<number, UserRole> = {
        1: "admin",
        2: "company",
        3: "student",
        4: "mentor",
      };

      const nameMap: Record<number, string> = {
        1: response.data.adminName,
        2: response.data.companyName,
        3: response.data.studentName,
        4: response.data.mentorName,
      };

      const userTypeId = response.data.userTypeId;
      const role = roleMap[userTypeId];
      const name = nameMap[userTypeId];

      if (!role || !name) {
        throw new Error("Invalid user type");
      }

      const userData: UserData = {
        role,
        name,
        avatar: response.data.profileImage || null,
        notificationCount: response.data.notificationCount || 0,
      };

      // Ensure user is set before navigating
      updateUser(userData);

      // Navigate to appropriate dashboard based on role
      const dashboardPaths: Record<UserRole, string> = {
        student: "/student/dashboard",
        company: "/company/dashboard",
        mentor: "/mentor/dashboard",
        admin: "/admin/dashboard",
      };

      // Add a small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate(dashboardPaths[role]);
        toast.success(`Welcome back, ${name}!`);
      }, 100);
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorMessage = err?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col lg:flex-row">
      {/* Mobile Branding Section */}
      <div className="lg:hidden bg-gradient-hero p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="text-2xl font-bold">CareerGlide</div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
            asChild
          >
            <a href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </a>
          </Button>
        </div>
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="text-white/90 max-w-md mx-auto">
            Sign in to continue your career journey with CareerGlide
          </p>
        </div>
        <div className="flex justify-center space-x-8 py-4">
          {["Jobs", "Mentors", "Tracking"].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="text-4xl font-bold mb-6">CareerGlide</div>
          <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
          <p className="text-white/90 mb-8">
            Continue your journey to career success. Connect, learn, and grow
            with our platform.
          </p>
          <div className="space-y-3">
            {["Browse Jobs", "Find Mentors", "Track Applications"].map(
              (feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-white/80"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>{feature}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Desktop Back Button */}
          <div className="hidden lg:block">
            <Button variant="ghost" size="sm" className="mb-4" asChild>
              <a href="/" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </a>
            </Button>
          </div>

          {/* Login Form Card */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="space-y-1 text-center pt-8 lg:pt-6">
              <div className="lg:hidden text-center mb-4">
                <div className="text-2xl font-bold text-indigo-600">
                  CareerGlide
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Login
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-indigo-600 hover:text-indigo-800"
                  >
                    <a href="/forgot-password">Forgot password?</a>
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Separator className="my-2" />
              <div className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 text-indigo-600 hover:text-indigo-800 font-medium"
                  asChild
                >
                  <a href="/register">Sign up here</a>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
