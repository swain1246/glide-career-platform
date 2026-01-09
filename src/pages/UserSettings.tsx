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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button variant="ghost" className="mr-2 p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarImage src={user.profileImage} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-800">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {user.name}
                      </h2>
                      <div className="flex flex-col gap-1 mt-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 text-blue-500" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
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
            <Card className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Lock className="h-5 w-5 text-blue-600" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex-grow">
                {/* Success Message */}
                {passwordSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {passwordError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-700">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
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
                  <Label htmlFor="new-password" className="text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500"
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
                  <Label htmlFor="confirm-password" className="text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isChangingPassword}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
            <Card className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Delete Account
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 flex-grow">
                {/* Success Message */}
                {deleteSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>{deleteSuccess}</AlertDescription>
                  </Alert>
                )}

                {/* Warning */}
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
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
                  className="w-full bg-red-600 hover:bg-red-700"
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
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-800">
                  This will permanently delete your account and all associated
                  data.
                </p>
                <p className="text-sm text-gray-600">
                  You will receive an OTP to confirm this action.
                </p>
              </div>
            </div>
            {deleteError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSendOTP}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Send OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP Verification Modal */}
      <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <Shield className="h-5 w-5 text-blue-600" />
              Verify Your Identity
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              We've sent a 6-digit OTP to your registered email address. Please
              enter it below to confirm your identity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <p className="text-center text-gray-700">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-medium">{user.email}</span>
              </p>
            </div>
            {deleteError && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700">
                One-Time Password (OTP)
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowOTPModal(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOTP}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              Verify OTP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final Confirmation Modal */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-800">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Final Confirmation
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-800">
                  This is your last chance to cancel this action.
                </p>
                <p className="text-sm text-gray-600">
                  Your account will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete(false)}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
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
