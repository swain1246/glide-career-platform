import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AddUpdateStudentIntership } from '@/api/studentServices'; // Import the API service

interface InternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  internship?: {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
    projectName?: string;
    skills?: string;
    projectUrl?: string;
  };
  onUpdateSuccess?: () => void; // Add callback for successful update
}

export const InternshipModal: React.FC<InternshipModalProps> = ({
  isOpen,
  onClose,
  internship,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    id: internship?.id || '0',
    company: internship?.company || '',
    role: internship?.role || '',
    duration: internship?.duration || '',
    description: internship?.description || '',
    projectName: internship?.projectName || '',
    skills: internship?.skills || '',
    projectUrl: internship?.projectUrl || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data for API submission
      const submissionData = {
        id: parseInt(formData.id),
        companyName: formData.company,
        designation: formData.role,
        internshipDuration: parseInt(formData.duration) || 0,
        projectName: formData.projectName || null,
        skills: formData.skills || null,
        description: formData.description || null,
        projectUrl: formData.projectUrl || null,
      };

      // Call the API service
      const response = await AddUpdateStudentIntership(submissionData);
      
      if (response.success) {
        // Show success message
        toast.success(internship ? 'Internship updated successfully!' : 'Internship added successfully!');
        
        // Close the modal
        onClose();
        
        // Trigger parent component refresh if callback is provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        // Show error message
        toast.error(response.message || 'Failed to save internship details');
      }
    } catch (error: any) {
      console.error('Error saving internship:', error);
      toast.error(error.response?.data?.Message || 'An error occurred while saving internship details');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: internship?.id || '0',
        company: internship?.company || '',
        role: internship?.role || '',
        duration: internship?.duration || '',
        description: internship?.description || '',
        projectName: internship?.projectName || '',
        skills: internship?.skills || '',
        projectUrl: internship?.projectUrl || '',
      });
    }
  }, [isOpen, internship]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {internship ? 'Edit Internship' : 'Add Internship'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="e.g., Google"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role/Position</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Software Developer"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 3"
                min="1"
                max="24"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                placeholder="e.g., E-commerce Platform"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills Used</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g., React, Node.js"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                type="url"
                value={formData.projectUrl}
                onChange={(e) => handleInputChange('projectUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your work and achievements"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (internship ? 'Update' : 'Add')} Internship
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};