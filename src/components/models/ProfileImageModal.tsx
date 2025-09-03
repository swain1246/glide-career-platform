import React, { useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import maleAvatar from '@/assets/avatars/male-1.png';
import { UploadProfileImage, GetProfileImage, DeleteUserProfileImage } from "@/api/userServices";

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string | null; // This is the filename
  onUpdateSuccess: () => void;
}

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isOpen,
  onClose,
  currentImage,
  onUpdateSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);

  // Fetch current profile image when component mounts or currentImage changes
  useEffect(() => {
    const fetchCurrentImage = async () => {
      if (!currentImage) {
        setCurrentImageUrl(null);
        return;
      }
      
      setImageLoading(true);
      
      try {
        const imageBlob = await GetProfileImage(currentImage);
        const imageUrl = URL.createObjectURL(imageBlob);
        setCurrentImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching current profile image:", error);
        setCurrentImageUrl(null);
      } finally {
        setImageLoading(false);
      }
    };

    fetchCurrentImage();

    // Clean up the object URL when the component unmounts or when the image changes
    return () => {
      if (currentImageUrl) {
        URL.revokeObjectURL(currentImageUrl);
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [currentImage]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadError(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        setUploadError("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size must be less than 5MB");
        return;
      }
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Call the API to upload the profile image
      const response = await UploadProfileImage(selectedFile);
      
      // Check if the upload was successful
      if (response && response.success) {
        onUpdateSuccess();
        onClose();
      } else {
        setUploadError(response?.message || "Failed to upload image. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      setUploadError(error.response?.data?.message || error.message || "An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentImage) return;
    
    setIsDeleting(true);
    setUploadError(null);
    
    try {
      // Call the API to delete the profile image
      const response = await DeleteUserProfileImage();
      
      // Check if the deletion was successful
      if (response && response.success) {
        onUpdateSuccess();
        onClose();
      } else {
        setUploadError(response?.message || "Failed to remove profile image. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting profile image:", error);
      setUploadError(error.response?.data?.message || error.message || "An error occurred during deletion");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-md w-full mx-auto p-4 md:p-6 rounded-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg md:text-xl">Profile Picture</DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Update or remove your profile picture
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 md:space-y-6 py-4">
          <div className="relative">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-border">
              {imageLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <AvatarImage 
                  src={previewUrl || currentImageUrl || maleAvatar} 
                  alt="Profile" 
                />
              )}
              <AvatarFallback className="text-xl md:text-2xl">
                {localStorage.getItem("userName")?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
          
          <div className="w-full space-y-4 md:space-y-6">
            <div>
              <label htmlFor="profile-image-upload" className="block text-sm font-medium mb-1 md:mb-2">
                Upload New Picture
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPEG, PNG. Max size: 5MB
              </p>
            </div>
            
            {uploadError && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                {uploadError}
              </div>
            )}
            
            {currentImage && (
              <div className="pt-2 border-t">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full h-10 md:h-9"
                >
                  {isDeleting ? "Removing..." : "Remove Current Picture"}
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          {selectedFile && (
            <Button onClick={handleUpload} disabled={isUploading} className="w-full sm:w-auto">
              {isUploading ? "Uploading..." : "Upload Picture"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileImageModal;