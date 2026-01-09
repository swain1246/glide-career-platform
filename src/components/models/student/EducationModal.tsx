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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { AddUpdateStudentEducation } from '@/api/studentServices'; // Import the API service

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education?: {
    id: string;
    level: string;
    institution: string;
    year: string;
    grade: string;
    examinationBoard?: string;
    mediumOfStudy?: string;
    passingYear?: string;
    courseName?: string;
    specialization?: string;
    collegeName?: string;
    startDate?: string;
    endDate?: string;
  };
  onUpdateSuccess?: () => void; // Add callback for successful update
  // We'll use this to get existing education levels from parent
  getExistingEducationLevels?: () => string[];
}

export const EducationModal: React.FC<EducationModalProps> = ({
  isOpen,
  onClose,
  education,
  onUpdateSuccess,
  getExistingEducationLevels,
}) => {
  const [formData, setFormData] = useState({
    id: education?.id || '0',
    level: education?.level || '',
    institution: education?.institution || '',
    year: education?.year || '',
    grade: education?.grade || '',
    examinationBoard: education?.examinationBoard || '',
    mediumOfStudy: education?.mediumOfStudy || '',
    passingYear: education?.passingYear || '',
    courseName: education?.courseName || '',
    specialization: education?.specialization || '',
    collegeName: education?.collegeName || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableEducationLevels, setAvailableEducationLevels] = useState<string[]>([]);
  
  const allEducationLevels = [
    'X (10th Grade)',
    'XII (12th Grade)',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'Doctorate (PhD)',
  ];
  
  const isSchoolLevel = (level: string) => {
    return level === 'X (10th Grade)' || level === 'XII (12th Grade)';
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data based on education level
      const submissionData: any = {
        id: parseInt(formData.id),
        qualification: formData.level,
        percentage: parseFloat(formData.grade) || 0,
      };
      
      if (isSchoolLevel(formData.level)) {
        Object.assign(submissionData, {
          examinationBoard: formData.examinationBoard,
          mediumOfStudy: formData.mediumOfStudy,
          passingYear: parseInt(formData.passingYear) || null,
          schoolName: formData.institution, // Using institution as schoolName
        });
      } else {
        Object.assign(submissionData, {
          courseName: formData.courseName,
          specialization: formData.specialization,
          collegeName: formData.institution, // Using institution as collegeName
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
      }
      
      // Call the API service
      const response = await AddUpdateStudentEducation(submissionData);
      
      if (response.success) {
        // Show success message
        toast.success(education ? 'Education updated successfully!' : 'Education added successfully!');
        
        // Close the modal
        onClose();
        
        // Trigger parent component refresh if callback is provided
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        // Show error message
        toast.error(response.message || 'Failed to save education details');
      }
    } catch (error: any) {
      console.error('Error saving education:', error);
      toast.error(error.response?.data?.Message || 'An error occurred while saving education details');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update available education levels when modal opens
  useEffect(() => {
    if (isOpen) {
      // If editing, show all education levels
      if (education) {
        setAvailableEducationLevels(allEducationLevels);
      } 
      // If adding, filter out existing education levels
      else if (getExistingEducationLevels) {
        const existingLevels = getExistingEducationLevels();
        const filteredLevels = allEducationLevels.filter(level => !existingLevels.includes(level));
        setAvailableEducationLevels(filteredLevels);
      } else {
        // Fallback: show all levels if we can't get existing ones
        setAvailableEducationLevels(allEducationLevels);
      }
    }
  }, [isOpen, education, getExistingEducationLevels]);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: education?.id || '0',
        level: education?.level || '',
        institution: education?.institution || '',
        year: education?.year || '',
        grade: education?.grade || '',
        examinationBoard: education?.examinationBoard || '',
        mediumOfStudy: education?.mediumOfStudy || '',
        passingYear: education?.passingYear || '',
        courseName: education?.courseName || '',
        specialization: education?.specialization || '',
        collegeName: education?.collegeName || '',
        startDate: education?.startDate || '',
        endDate: education?.endDate || '',
      });
    }
  }, [isOpen, education]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {education ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Always show education level selector */}
          <div className="space-y-2">
            <Label htmlFor="level">Education Level</Label>
            <Select 
              value={formData.level} 
              onValueChange={(value) => handleInputChange('level', value)}
              disabled={!!education} // Disable if editing
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {availableEducationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {education && (
              <p className="text-xs text-muted-foreground">
                Education level cannot be changed when editing
              </p>
            )}
            {!education && availableEducationLevels.length === 0 && (
              <p className="text-xs text-muted-foreground">
                You have added all available education levels
              </p>
            )}
          </div>
          
          {/* Show fields based on education level */}
          {(formData.level || education) && (
            <>
              {isSchoolLevel(formData.level) || (education && isSchoolLevel(education.level)) ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">School Name</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="Enter school name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="examinationBoard">Examination Board</Label>
                      <Input
                        id="examinationBoard"
                        value={formData.examinationBoard}
                        onChange={(e) => handleInputChange('examinationBoard', e.target.value)}
                        placeholder="e.g., CBSE"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mediumOfStudy">Medium of Study</Label>
                      <Input
                        id="mediumOfStudy"
                        value={formData.mediumOfStudy}
                        onChange={(e) => handleInputChange('mediumOfStudy', e.target.value)}
                        placeholder="e.g., English"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passingYear">Passing Year</Label>
                      <Input
                        id="passingYear"
                        type="number"
                        value={formData.passingYear}
                        onChange={(e) => handleInputChange('passingYear', e.target.value)}
                        placeholder="e.g., 2020"
                        min="1950"
                        max="2030"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution Name</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        placeholder="Enter institution name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={formData.courseName}
                        onChange={(e) => handleInputChange('courseName', e.target.value)}
                        placeholder="e.g., B.Tech"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="e.g., Computer Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade/Percentage</Label>
                      <Input
                        id="grade"
                        type="text"
                        value={formData.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        placeholder="e.g., 85%"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              {/* Show grade field for school level in a single row */}
              {(isSchoolLevel(formData.level) || (education && isSchoolLevel(education.level))) && (
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade/Percentage</Label>
                  <Input
                    id="grade"
                    type="text"
                    value={formData.grade}
                    onChange={(e) => handleInputChange('grade', e.target.value)}
                    placeholder="e.g., 85%"
                    required
                  />
                </div>
              )}
            </>
          )}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.level || isSubmitting}>
              {isSubmitting ? 'Saving...' : (education ? 'Update' : 'Add')} Education
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};