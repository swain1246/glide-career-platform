import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle, Loader2, Circle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  StudentRegister,
  companyRegister,
  mentorRegister,
  reSendRegistrationOtp,
  VerifyRegisterOTP,
} from "@/api/authService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "../components/ui/toast";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"student" | "company" | "mentor">(
    "student"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [formData, setFormData] = useState({
    // Base fields
    email: "",
    password: "",
    confirmPassword: "",
    // Student fields
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    college: "",
    degree: "",
    registrationNumber: "",
    yearOfPassing: "",
    // Company fields
    companyName: "",
    contactPersonName: "",
    contactPersonDesignation: "",
    supportEmail: "",
    phoneNumber: "",
    gstIn: "",
    panNumber: "",
    website: "",
    industry: "",
    location: "",
    linkedinUrl: "",
    // Mentor fields
    mentorFirstName: "",
    mentorLastName: "",
    mentorPhoneNumber: "",
    designation: "",
    mentorCompanyName: "",
    experienceYears: "",
    bio: "",
  });
  
  const userTypeConfig = {
    student: {
      title: "Student",
      description:
        "Start your career journey with access to internships and mentors",
      color: "bg-primary text-primary-foreground",
      icon: "🎓",
    },
    company: {
      title: "Company",
      description: "Find talented students and post internship opportunities",
      color: "bg-accent text-accent-foreground",
      icon: "🏢",
    },
    mentor: {
      title: "Mentor",
      description: "Share your expertise and guide the next generation",
      color: "bg-success text-success-foreground",
      icon: "👨‍🏫",
    },
  };
  
  // Handle resend OTP timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);
  
  // Show error toast
  const showError = (message: string) => {
    setError(message);
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 3000);
  };
  
  // Show success toast
  const showSuccess = (message: string) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };
  
  // Validate password
  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[^A-Za-z0-9]/.test(password)
    };
    
    setPasswordValidation(validation);
    return Object.values(validation).every(Boolean);
  };
  
  // Validate form based on user type
  const validateForm = () => {
    const errors: string[] = [];
    
    // Common validations
    if (!formData.email) errors.push("email");
    if (!formData.password) {
      errors.push("password");
    } else if (!validatePassword(formData.password)) {
      errors.push("password");
      setShowPasswordValidation(true);
    }
    
    // User type specific validations
    if (userType === "student") {
      if (!formData.firstName) errors.push("firstName");
      if (!formData.lastName) errors.push("lastName");
      if (!formData.college) errors.push("college");
    } else if (userType === "company") {
      if (!formData.companyName) errors.push("companyName");
    } else if (userType === "mentor") {
      if (!formData.mentorFirstName) errors.push("mentorFirstName");
      if (!formData.mentorLastName) errors.push("mentorLastName");
      if (!formData.designation) errors.push("designation");
      if (!formData.mentorCompanyName) errors.push("mentorCompanyName");
      if (!formData.experienceYears) errors.push("experienceYears");
    }
    
    setInvalidFields(errors);
    
    if (errors.length > 0) {
      showError("Please fill in all required fields");
      return false;
    }
    
    return true;
  };
  
  // API call to register user based on role
  const registerUser = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError("");
    
    try {
      let endpoint = "";
      let payload = {};
      
      // Prepare payload based on user type
      if (userType === "student") {
        endpoint = "/api/student/register";
        payload = {
          Email: formData.email,
          Password: formData.password,
          FirstName: formData.firstName,
          LastName: formData.lastName,
          DateOfBirth: formData.dateOfBirth,
          Gender: formData.gender,
          Degree: formData.degree,
          College: formData.college,
          RegistrationNumber: formData.registrationNumber,
          YearOfPassing: formData.yearOfPassing,
        };
      } else if (userType === "company") {
        endpoint = "/api/company/register";
        payload = {
          LoginEmail: formData.email,
          Password: formData.password,
          CompanyName: formData.companyName,
          ContactPersonName: formData.contactPersonName,
          ContactPersionDesignation: formData.contactPersonDesignation,
          SupportEmail: formData.supportEmail,
          PhoneNumber: formData.phoneNumber,
          GstIn: formData.gstIn,
          PanNumber: formData.panNumber,
          Website: formData.website,
          Industry: formData.industry,
          Location: formData.location,
          LinkedinUrl: formData.linkedinUrl,
        };
      } else if (userType === "mentor") {
        endpoint = "/api/mentor/register";
        payload = {
          Email: formData.email,
          Password: formData.password,
          FirstName: formData.mentorFirstName,
          LastName: formData.mentorLastName,
          PhoneNumber: formData.mentorPhoneNumber,
          Designation: formData.designation,
          CompanyName: formData.mentorCompanyName,
          ExperienceYears: parseInt(formData.experienceYears), // ensure it's number!
          Bio: formData.bio,
        };
      }
      
      console.log(payload);
      console.log(userType);
      
      // Make API call
      const response = await (userType === "student"
        ? StudentRegister
        : userType === "company"
        ? companyRegister
        : mentorRegister)(payload);
      
      // Store the email from response for OTP verification
      setRegisteredEmail(response.data.email || formData.email);
      
      // Now send OTP
      setOtpSent(true);
      setResendTimer(30);
      
      // Show success toast
      showSuccess("Registration successful! Please verify your email.");
      
      // Move to OTP step
      nextStep();
    } catch (err: any) {
      showError(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  // API call to send OTP
  const sendOtpToEmail = async (email: string) => {
    try {
      const response = await reSendRegistrationOtp(setRegisteredEmail);
      if (!response.success) {
        throw new Error(response?.data?.message || "Failed to send OTP");
      }
      setOtpSent(true);
      setResendTimer(30);
      showSuccess("OTP resent successfully!");
    } catch (err: any) {
      showError(err?.response?.data?.message || "Failed to send OTP");
      throw err; // Re-throw to handle in the calling function
    }
  };
  
  // API call to verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    
    try {
      const otpCode = otp.join("");
      var response = await VerifyRegisterOTP({
        Email: registeredEmail,
        OTP: otpCode,
      });
      
      if (!response.success) {
        throw new Error(response?.data.message || "Invalid OTP");
      }
      
      // Show success toast
      showSuccess("Email verified successfully! Redirecting to login...");
      
      // Redirect to login page on successful verification
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      showError(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
  
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus the last filled input or the next empty one
      const lastIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };
  
  // Check if OTP is completely filled
  const isOtpComplete = otp.every((digit) => digit !== "");
  
  const renderUserTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Your Role</h2>
        <p className="text-muted-foreground hidden sm:block">
          Select the option that best describes you
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {(
          Object.keys(userTypeConfig) as Array<keyof typeof userTypeConfig>
        ).map((type) => {
          const config = userTypeConfig[type];
          return (
            <Card
              key={type}
              className={`cursor-pointer transition-all hover:shadow-md ${
                userType === type 
                  ? "ring-2 ring-primary shadow-md border-primary" 
                  : "border-border"
              }`}
              onClick={() => setUserType(type)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl flex-shrink-0">{config.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{config.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1 hidden sm:block">
                      {config.description}
                    </p>
                  </div>
                  {userType === type && (
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
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
          {userTypeConfig[userType].icon}{" "}
          {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </Badge>
        <h2 className="text-2xl font-bold mt-4 mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form className="space-y-4">
        {/* Common fields for all user types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className={invalidFields.includes("email") ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  // Hide password validation when user starts typing again
                  if (showPasswordValidation) setShowPasswordValidation(false);
                }}
                required
                className={invalidFields.includes("password") ? "border-red-500" : ""}
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
            
            {/* Password validation - only show when validation is triggered */}
            {showPasswordValidation && (
              <div className="bg-gray-50 p-3 rounded-lg mt-2">
                <p className="font-medium mb-2 text-gray-700 text-sm">Password must contain:</p>
                <ul className="space-y-1">
                  <li className={`flex items-center text-sm ${passwordValidation.length ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">
                      {passwordValidation.length ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    At least 8 characters
                  </li>
                  <li className={`flex items-center text-sm ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">
                      {passwordValidation.uppercase ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    One uppercase letter
                  </li>
                  <li className={`flex items-center text-sm ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">
                      {passwordValidation.lowercase ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    One lowercase letter
                  </li>
                  <li className={`flex items-center text-sm ${passwordValidation.number ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">
                      {passwordValidation.number ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    One number
                  </li>
                  <li className={`flex items-center text-sm ${passwordValidation.specialChar ? 'text-green-600' : 'text-red-500'}`}>
                    <span className="mr-2">
                      {passwordValidation.specialChar ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    One special character
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Student-specific fields */}
        {userType === "student" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  className={invalidFields.includes("firstName") ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  className={invalidFields.includes("lastName") ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="college">College/University *</Label>
                <Input
                  id="college"
                  placeholder="Enter your college name"
                  value={formData.college}
                  onChange={(e) =>
                    setFormData({ ...formData, college: e.target.value })
                  }
                  required
                  className={invalidFields.includes("college") ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  placeholder="e.g. BTech, BE"
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  placeholder="Enter your registration number"
                  value={formData.registrationNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      registrationNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfPassing">Year of Passing</Label>
                <Input
                  id="yearOfPassing"
                  type="number"
                  placeholder="e.g. 2025"
                  value={formData.yearOfPassing}
                  onChange={(e) =>
                    setFormData({ ...formData, yearOfPassing: e.target.value })
                  }
                />
              </div>
            </div>
          </>
        )}
        
        {/* Company-specific fields */}
        {userType === "company" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  required
                  className={invalidFields.includes("companyName") ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://company.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPersonName">Contact Person Name</Label>
                <Input
                  id="contactPersonName"
                  placeholder="Enter contact person name"
                  value={formData.contactPersonName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPersonDesignation">
                  Contact Person Designation
                </Label>
                <Input
                  id="contactPersonDesignation"
                  placeholder="e.g. HR Manager"
                  value={formData.contactPersonDesignation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactPersonDesignation: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  placeholder="support@company.com"
                  value={formData.supportEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, supportEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstIn">GSTIN</Label>
                <Input
                  id="gstIn"
                  placeholder="Enter GSTIN"
                  value={formData.gstIn}
                  onChange={(e) =>
                    setFormData({ ...formData, gstIn: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  placeholder="Enter PAN number"
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  placeholder="e.g. Technology, Healthcare"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/company/yourcompany"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
              />
            </div>
          </>
        )}
        
        {/* Mentor-specific fields */}
        {userType === "mentor" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mentorFirstName">First Name *</Label>
                <Input
                  id="mentorFirstName"
                  placeholder="Enter your first name"
                  value={formData.mentorFirstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorFirstName: e.target.value,
                    })
                  }
                  required
                  className={invalidFields.includes("mentorFirstName") ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentorLastName">Last Name *</Label>
                <Input
                  id="mentorLastName"
                  placeholder="Enter your last name"
                  value={formData.mentorLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, mentorLastName: e.target.value })
                  }
                  required
                  className={invalidFields.includes("mentorLastName") ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mentorPhoneNumber">Phone Number</Label>
                <Input
                  id="mentorPhoneNumber"
                  placeholder="Enter phone number"
                  value={formData.mentorPhoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorPhoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation *</Label>
                <Input
                  id="designation"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  required
                  className={invalidFields.includes("designation") ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mentorCompanyName">Company *</Label>
                <Input
                  id="mentorCompanyName"
                  placeholder="Current company"
                  value={formData.mentorCompanyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorCompanyName: e.target.value,
                    })
                  }
                  required
                  className={invalidFields.includes("mentorCompanyName") ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience *</Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, experienceYears: value })
                  }
                >
                  <SelectTrigger className={invalidFields.includes("experienceYears") ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="6">6 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                    <SelectItem value="8">8 years</SelectItem>
                    <SelectItem value="9">9 years</SelectItem>
                    <SelectItem value="10">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
          </>
        )}
      </form>
      
      <div className="flex gap-3">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={registerUser} className="flex-1" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );
  
  const renderOtpVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a verification code to{" "}
          <span className="font-medium">{registeredEmail}</span>
        </p>
      </div>
      
      {error && (
        <div className="bg-destructive/15 text-destructive p-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-center">Enter Verification Code</Label>
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-primary"
              />
            ))}
          </div>
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => sendOtpToEmail(registeredEmail)}
              disabled={resendTimer > 0 || loading}
              className="p-0"
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Didn't receive the code? Resend"}
            </Button>
          </div>
        </div>
        <Button
          onClick={verifyOtp}
          className={`w-full ${userTypeConfig[userType].color}`}
          disabled={!isOtpComplete || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          For demo purposes, use verification code:{" "}
          <span className="font-mono font-bold">123456</span>
        </p>
      </div>
    </div>
  );
  
  return (
    <ToastProvider>
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
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
                      <div
                        className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                          i < step ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <Card>
            <CardContent className="p-6 sm:p-8">
              {step === 1 && renderUserTypeSelection()}
              {step === 2 && renderBasicInfo()}
              {step === 3 && renderOtpVerification()}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Error Toast */}
      {showErrorToast && (
        <Toast
          variant="destructive"
          className="border border-red-500 bg-red-50 text-red-800"
        >
          <div className="grid gap-1">
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </div>
        </Toast>
      )}
      
      {/* Success Toast */}
      {showSuccessToast && (
        <Toast
          className="border border-green-500 bg-green-50 text-green-800"
        >
          <div className="grid gap-1">
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
          </div>
        </Toast>
      )}
      
      <ToastViewport />
    </ToastProvider>
  );
};

export default RegisterPage;