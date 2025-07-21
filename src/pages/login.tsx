import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "company" | "mentor">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password, userType });
    
    // Mock navigation based on user type
    const routes = {
      student: "/student/dashboard",
      company: "/company/dashboard", 
      mentor: "/mentor/dashboard"
    };
    
    window.location.href = routes[userType];
  };

  const userTypeConfig = {
    student: {
      title: "Student Login",
      description: "Access your dashboard to explore jobs and mentors",
      color: "bg-primary text-primary-foreground",
      features: ["Browse Jobs", "Find Mentors", "Track Applications"]
    },
    company: {
      title: "Company Login",
      description: "Manage your job postings and find talented students", 
      color: "bg-accent text-accent-foreground",
      features: ["Post Jobs", "Review Applications", "Access Talent Pool"]
    },
    mentor: {
      title: "Mentor Login",
      description: "Connect with students and share your expertise",
      color: "bg-success text-success-foreground", 
      features: ["Find Students", "Schedule Sessions", "Track Progress"]
    }
  };

  const currentConfig = userTypeConfig[userType];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="text-4xl font-bold mb-6">CareerGlide</div>
          <h2 className="text-2xl font-semibold mb-4">Welcome Back!</h2>
          <p className="text-white/90 mb-8">
            Continue your journey to career success. Connect, learn, and grow with our platform.
          </p>
          <div className="space-y-3">
            {currentConfig.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Back to home */}
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <a href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </a>
          </Button>

          {/* User type selector */}
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Sign In</h1>
              <p className="text-muted-foreground">Choose your account type</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(userTypeConfig) as Array<keyof typeof userTypeConfig>).map((type) => (
                <Button
                  key={type}
                  variant={userType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUserType(type)}
                  className={userType === type ? userTypeConfig[type].color : ""}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Login form */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>{currentConfig.title}</CardTitle>
              <CardDescription>
                {currentConfig.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

                <div className="flex items-center justify-between">
                  <Button variant="link" size="sm" className="p-0">
                    Forgot password?
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${currentConfig.color}`}
                >
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="p-0" asChild>
                  <a href="/register">Sign up here</a>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Demo credentials */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Demo Credentials:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>Email: demo@careerglide.com</p>
                  <p>Password: demo123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;