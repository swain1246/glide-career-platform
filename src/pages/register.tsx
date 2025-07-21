import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"student" | "company" | "mentor">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    // Student specific
    college: "",
    year: "",
    // Company specific
    companyName: "",
    website: "",
    // Mentor specific
    title: "",
    company: "",
    experience: "",
    // Common
    bio: "",
    skills: [] as string[],
    agreeToTerms: false
  });

  const userTypeConfig = {
    student: {
      title: "Join as Student",
      description: "Start your career journey with access to internships and mentors",
      color: "bg-primary text-primary-foreground",
      icon: "🎓"
    },
    company: {
      title: "Join as Company", 
      description: "Find talented students and post internship opportunities",
      color: "bg-accent text-accent-foreground",
      icon: "🏢"
    },
    mentor: {
      title: "Join as Mentor",
      description: "Share your expertise and guide the next generation",
      color: "bg-success text-success-foreground",
      icon: "👨‍🏫"
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", { userType, ...formData });
    // Mock success - redirect to login
    window.location.href = "/login";
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
        <p className="text-muted-foreground">Select the option that best describes you</p>
      </div>

      <div className="grid gap-4">
        {(Object.keys(userTypeConfig) as Array<keyof typeof userTypeConfig>).map((type) => {
          const config = userTypeConfig[type];
          return (
            <Card 
              key={type} 
              className={`cursor-pointer transition-all hover:shadow-card-hover ${
                userType === type ? "ring-2 ring-primary shadow-card-hover" : ""
              }`}
              onClick={() => setUserType(type)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{config.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{config.title}</h3>
                    <p className="text-muted-foreground">{config.description}</p>
                  </div>
                  {userType === type && (
                    <CheckCircle className="h-6 w-6 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button onClick={nextStep} className="w-full" disabled={!userType}>
        Continue
      </Button>
    </div>
  );

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="outline" className={userTypeConfig[userType].color}>
          {userTypeConfig[userType].icon} {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </Badge>
        <h2 className="text-2xl font-bold mt-4 mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Role-specific fields */}
        {userType === "student" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="college">College/University *</Label>
              <Input
                id="college"
                placeholder="Enter your college name"
                value={formData.college}
                onChange={(e) => setFormData({...formData, college: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year of Study *</Label>
              <Select onValueChange={(value) => setFormData({...formData, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">First Year</SelectItem>
                  <SelectItem value="second">Second Year</SelectItem>
                  <SelectItem value="third">Third Year</SelectItem>
                  <SelectItem value="final">Final Year</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {userType === "company" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="https://company.com"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>
        )}

        {userType === "mentor" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Current company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Select onValueChange={(value) => setFormData({...formData, experience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
          />
        </div>
      </form>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
        <p className="text-muted-foreground">Review and complete your registration</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData({...formData, agreeToTerms: checked as boolean})
                }
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          className={`flex-1 ${userTypeConfig[userType].color}`}
          disabled={!formData.agreeToTerms}
        >
          Create Account
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button variant="link" className="p-0" asChild>
          <a href="/login">Sign in here</a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" className="mb-4" asChild>
            <a href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </a>
          </Button>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              CareerGlide
            </div>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      i <= step 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      i < step ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            {step === 1 && renderUserTypeSelection()}
            {step === 2 && renderBasicInfo()}
            {step === 3 && renderFinalStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;