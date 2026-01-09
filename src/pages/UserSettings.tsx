import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { ChangePassword } from "@/api/userServices"; // Import the service method

const UserSettings: React.FC = () => {
  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Loading state
  
  // State for account deletion
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  
  // Mock user data
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  // Handle password change with API integration
  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validation
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      
      // Prepare data for API call
      const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };
      
      // Call the API service
      const response = await ChangePassword(passwordData);
      console.log("after responce", response);
      
      // Handle successful response
      if (response.success) {
        setPasswordSuccess("Password changed successfully");
        // Reset form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        // Handle API error response
        setPasswordError(response.message || "Failed to change password");
      }
    } catch (error: any) {
      // Handle network or other errors
      console.error("Error changing password:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setPasswordError(error.response.data.message);
      } else {
        setPasswordError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handle account deletion initiation
  const handleInitiateDelete = () => {
    setShowDeleteModal(true);
  };

  // Handle OTP sending
  const handleSendOTP = () => {
    setDeleteError("");
    // In a real app, you would call an API to send OTP
    // For demo purposes, we'll just show the OTP modal
    setShowDeleteModal(false);
    setShowOTPModal(true);
  };

  // Handle OTP verification and account deletion
  const handleVerifyOTP = () => {
    setDeleteError("");
    
    // Validation
    if (!otp) {
      setDeleteError("OTP is required");
      return;
    }
    
    // In a real app, you would verify the OTP with your backend
    // For demo purposes, we'll accept any 6-digit OTP
    if (otp.length !== 6 || isNaN(Number(otp))) {
      setDeleteError("Invalid OTP");
      return;
    }
    
    // Show confirmation dialog
    setShowOTPModal(false);
    setConfirmDelete(true);
  };

  // Handle final account deletion
  const handleDeleteAccount = () => {
    // In a real app, you would call an API to delete the account
    // For demo purposes, we'll just show a success message
    setDeleteSuccess("Account deleted successfully");
    setConfirmDelete(false);
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center mb-4">
              <Button variant="ghost" className="mr-2 p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Account Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="mb-6 md:mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-background">
                      <CheckCircle className="h-4 w-4 text-background" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                      <div className="flex flex-col gap-1 mt-3">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-4 w-4 mr-2 text-primary" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                          <span>{user.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password Card */}
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex-grow">
                {/* Success Message */}
                {passwordSuccess && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      {passwordSuccess}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Error Message */}
                {passwordError && (
                  <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-300">
                      {passwordError}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-foreground">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={isChangingPassword}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={isChangingPassword}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isChangingPassword}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <div className="p-6 pt-0">
                {/* Submit Button */}
                <Button 
                  onClick={handleChangePassword} 
                  className="w-full"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>
            </Card>

            {/* Delete Account Card */}
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Delete Account
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex-grow">
                {/* Success Message */}
                {deleteSuccess && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                      {deleteSuccess}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Warning */}
                <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-300">
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <div className="p-6 pt-0">
                {/* Delete Button */}
                <Button 
                  onClick={handleInitiateDelete} 
                  variant="destructive" 
                  className="w-full"
                >
                  Delete My Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-foreground">
                  This will permanently delete your account and all associated
                  data.
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive an OTP to confirm this action.
                </p>
              </div>
            </div>
            {deleteError && (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  {deleteError}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSendOTP}
              className="w-full sm:w-auto"
            >
              Send OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5 text-blue-600" />
              Verify Your Identity
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              We've sent a 6-digit OTP to your registered email address. Please
              enter it below to confirm your identity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <p className="text-center text-foreground">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-medium">{user.email}</span>
              </p>
            </div>
            {deleteError && (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  {deleteError}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-foreground">
                One-Time Password (OTP)
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowOTPModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOTP}
              className="w-full sm:w-auto"
            >
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Modal */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Final Confirmation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-foreground">
                  This is your last chance to cancel this action.
                </p>
                <p className="text-sm text-muted-foreground">
                  Your account will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto"
            >
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default UserSettings;