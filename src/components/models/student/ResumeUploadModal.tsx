import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { UploadStudentResume } from '@/api/studentServices';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResume?: {
    fileName: string;
    uploadDate: string;
  };
  onUpdateSuccess?: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  currentResume,
  onUpdateSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Reset error state
    setUploadError(null);
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Please select a PDF file only.');
      return;
    }
    
    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Call the API to upload the resume
      const response = await UploadStudentResume(selectedFile);
      
      // Check if the upload was successful
      if (response && response.success) {
        // Call the success callback if provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        onClose();
        setSelectedFile(null);
      } else {
        setUploadError(response?.message || 'Failed to upload resume. Please try again.');
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      setUploadError(error.response?.data?.message || error.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>
            {currentResume ? 'Update Resume' : 'Upload Resume'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentResume && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Current Resume:</p>
              <p className="font-medium">{currentResume.fileName}</p>
              <p className="text-xs text-muted-foreground">Uploaded: {currentResume.uploadDate}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Select New Resume (PDF only)</Label>
            
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 hover:bg-destructive/20 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Drag and drop your resume here, or click to select
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInputChange}
              className="hidden"
            />
            
            <p className="text-xs text-muted-foreground">
              Maximum file size: 5MB. Only PDF files are accepted.
            </p>
          </div>
          
          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};