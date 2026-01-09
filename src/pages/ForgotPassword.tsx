import { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Key, CheckCircle, Circle } from "lucide-react";
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
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "../components/ui/toast";
import { Separator } from "../components/ui/separator";
import { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword } from "../api/authService";

const ForgotPassword = () => {
  // Form states
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI states
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // Password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });
  
  // OTP input state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);
  
  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Update the full OTP string
    setOtp(newOtpDigits.join(""));
    
    // Move to next input if current one is filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle OTP key down (for backspace)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    
    if (pastedData.length === 0) return;
    
    const newOtpDigits = [...otpDigits];
    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newOtpDigits[i] = pastedData[i] || "";
    }
    
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(""));
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };
  
  // Handle sending OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await sendForgotPasswordOTP(email);
      if (response.success) {
        setSuccessMessage("OTP has been sent to your email");
        setShowSuccess(true);
        setStep(2);
      } else {
        setErrorMessage(response.message || "Failed to send OTP");
        setShowError(true);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to send OTP";
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
      // Auto-dismiss after 3 seconds
      setTimeout(() => setShowError(false), 3000);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await verifyForgotPasswordOTP({ email, otp: parseInt(otp) });
      if (response.success) {
        setSuccessMessage("OTP verified successfully");
        setShowSuccess(true);
        setStep(3);
      } else {
        setErrorMessage(response.message || "Invalid OTP");
        setShowError(true);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Invalid OTP";
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowError(false), 3000);
      setTimeout(() => setShowSuccess(false), 3000);
    }
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
  
  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    // Validate password strength
    if (!validatePassword(newPassword)) {
      setErrorMessage("Password does not meet requirements");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await resetPassword({ email, newPassword });
      if (response.success) {
        setSuccessMessage("Password reset successfully");
        setShowSuccess(true);
        // Redirect to login after successful reset
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrorMessage(response.message || "Failed to reset password");
        setShowError(true);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to reset password";
      setErrorMessage(errorMsg);
      setShowError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowError(false), 3000);
    }
  };
  
  // Reset the process
  const handleReset = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setOtpDigits(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordValidation({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false
    });
  };
  
  return (
    <ToastProvider>
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
              <a href="/login" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </a>
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= num ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  {step > num ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium">{num}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span className={step >= 1 ? "text-white" : "text-white/70"}>Email</span>
              <span className={step >= 2 ? "text-white" : "text-white/70"}>Verify</span>
              <span className={step >= 3 ? "text-white" : "text-white/70"}>Password</span>
            </div>
          </div>
          
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-white/90 max-w-md mx-auto">
              {step === 1 && "Enter your email to receive a verification code"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Create a strong new password"}
            </p>
          </div>
        </div>
        
        {/* Desktop Branding Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="text-4xl font-bold mb-6">CareerGlide</div>
            <h2 className="text-2xl font-semibold mb-4">Reset Your Password</h2>
            <p className="text-white/90 mb-8">
              Follow the steps to securely reset your password and regain access to your account.
            </p>
            <div className="space-y-3">
              {["Enter your email", "Verify with OTP", "Set new password"].map(
                (feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-white/80"
                  >
                    <div className={`w-2 h-2 rounded-full ${step > index ? 'bg-green-400' : 'bg-white'}`}></div>
                    <span className={step === index + 1 ? 'text-white' : ''}>{feature}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white">
          <div className="w-full max-w-md space-y-8">
            {/* Desktop Back Button */}
            <div className="hidden lg:block">
              <Button variant="ghost" size="sm" className="mb-4" asChild>
                <a href="/login" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Login</span>
                </a>
              </Button>
            </div>
            
            {/* Form Card */}
            <Card className="bg-white border-0 shadow-lg lg:shadow-xl">
              <CardHeader className="space-y-1 text-center pt-8 lg:pt-6">
                <div className="lg:hidden text-center mb-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    CareerGlide
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {step === 1 && "Forgot Password"}
                  {step === 2 && "Verify OTP"}
                  {step === 3 && "Create New Password"}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {step === 1 && "Enter your email to receive a verification code"}
                  {step === 2 && "Enter the OTP sent to your email"}
                  {step === 3 && "Create a strong new password"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-6">
                {/* Step 1: Email Form */}
                {step === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Address
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
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                    </Button>
                  </form>
                )}
                
                {/* Step 2: OTP Form */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOTP} className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-gray-700 flex items-center justify-center">
                        <Key className="h-4 w-4 mr-2" />
                        Verification Code
                      </Label>
                      <div className="flex justify-center space-x-2 mt-4">
                        {otpDigits.map((digit, index) => (
                          <Input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={index === 0 ? handleOtpPaste : undefined}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="w-12 h-12 text-center text-xl font-semibold bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 text-center mt-4">
                        We've sent a 6-digit code to {email}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        Change Email
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </div>
                  </form>
                )}
                
                {/* Step 3: New Password Form */}
                {step === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-700 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
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
                      
                      {/* Password requirements */}
                      <div className="bg-gray-50 p-3 rounded-lg mt-3">
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
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          className="bg-gray-50 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-red-500 flex items-center">
                          <Circle className="h-4 w-4 mr-1" />
                          Passwords do not match
                        </p>
                      )}
                      {confirmPassword && newPassword === confirmPassword && (
                        <p className="text-sm text-green-600 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Passwords match
                        </p>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1"
                      >
                        Start Over
                      </Button>
                      <Button
                        type="submit"
                        disabled={isLoading || !Object.values(passwordValidation).every(Boolean) || newPassword !== confirmPassword}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
                <Separator className="my-2" />
                <div className="text-sm text-center text-gray-600">
                  Remember your password?{" "}
                  <Button
                    variant="link"
                    className="p-0 text-indigo-600 hover:text-indigo-800 font-medium"
                    asChild
                  >
                    <a href="/login">Back to Login</a>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Error Toast */}
        {showError && (
          <Toast
            variant="destructive"
            className="border border-red-500 bg-red-50 text-red-800"
          >
            <div className="grid gap-1">
              <ToastTitle>Error</ToastTitle>
              <ToastDescription>{errorMessage}</ToastDescription>
            </div>
          </Toast>
        )}
        
        {/* Success Toast */}
        {showSuccess && (
          <Toast
            className="border border-green-500 bg-green-50 text-green-800"
          >
            <div className="grid gap-1">
              <ToastTitle>Success</ToastTitle>
              <ToastDescription>{successMessage}</ToastDescription>
            </div>
          </Toast>
        )}
        
        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default ForgotPassword;