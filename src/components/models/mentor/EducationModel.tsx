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
import { AddUpdateMentorEducation } from '@/api/mentor/mentorProfileService';

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
  onUpdateSuccess?: () => void;
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
    passingYear: education?.passingYear || '',
    courseName: education?.courseName || '',
    specialization: education?.specialization || '',
    collegeName: education?.collegeName || '',
    startYear: education?.startDate?.substring(0, 4) || '',
    startMonth: education?.startDate?.substring(5, 7) || '',
    endYear: education?.endDate?.substring(0, 4) || '',
    endMonth: education?.endDate?.substring(5, 7) || '',
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
        id: parseInt(formData.id) || 0,
        qualification: formData.level,
        percentage: parseFloat(formData.grade) || 0,
      };
      
      if (isSchoolLevel(formData.level)) {
        Object.assign(submissionData, {
          examinationBoard: formData.examinationBoard,
          schoolName: formData.institution,
          passingYear: parseInt(formData.passingYear) || null,
        });
      } else {
        // Format the start and end dates as DateOnly (YYYY-MM-01)
        const startDate = formData.startYear && formData.startMonth 
          ? `${formData.startYear}-${formData.startMonth}-01` 
          : '';
        const endDate = formData.endYear && formData.endMonth 
          ? `${formData.endYear}-${formData.endMonth}-01` 
          : '';
          
        Object.assign(submissionData, {
          courseName: formData.courseName,
          specialization: formData.specialization,
          collegeName: formData.institution,
          startDate,
          endDate,
        });
      }
      
      // Call the actual API
      const response = await AddUpdateMentorEducation(submissionData);
      
      if (response.success) {
        toast.success(education ? 'Education updated successfully!' : 'Education added successfully!');
        onClose();
        
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        toast.error(response.message || "Failed to save education details");
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
      if (education) {
        setAvailableEducationLevels(allEducationLevels);
      } else if (getExistingEducationLevels) {
        const existingLevels = getExistingEducationLevels();
        const filteredLevels = allEducationLevels.filter(level => !existingLevels.includes(level));
        setAvailableEducationLevels(filteredLevels);
      } else {
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
        passingYear: education?.passingYear || '',
        courseName: education?.courseName || '',
        specialization: education?.specialization || '',
        collegeName: education?.collegeName || '',
        startYear: education?.startDate?.substring(0, 4) || '',
        startMonth: education?.startDate?.substring(5, 7) || '',
        endYear: education?.endDate?.substring(0, 4) || '',
        endMonth: education?.endDate?.substring(5, 7) || '',
      });
    }
  }, [isOpen, education]);
  
  // Generate years for dropdown (from 1950 to current year + 5)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1950; year <= currentYear + 5; year++) {
      years.push(year.toString());
    }
    return years;
  };
  
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
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
              disabled={!!education}
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="passingYear">Passing Year</Label>
                    <Select 
                      value={formData.passingYear} 
                      onValueChange={(value) => handleInputChange('passingYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {generateYears().map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  
                  {/* Start Date - Year and Month */}
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startYear" className="text-sm">Year</Label>
                        <Select 
                          value={formData.startYear} 
                          onValueChange={(value) => handleInputChange('startYear', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateYears().map(year => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startMonth" className="text-sm">Month</Label>
                        <Select 
                          value={formData.startMonth} 
                          onValueChange={(value) => handleInputChange('startMonth', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* End Date - Year and Month */}
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="endYear" className="text-sm">Year</Label>
                        <Select 
                          value={formData.endYear} 
                          onValueChange={(value) => handleInputChange('endYear', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {generateYears().map(year => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endMonth" className="text-sm">Month</Label>
                        <Select 
                          value={formData.endMonth} 
                          onValueChange={(value) => handleInputChange('endMonth', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(month => (
                              <SelectItem key={month.value} value={month.value}>
                                {month.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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