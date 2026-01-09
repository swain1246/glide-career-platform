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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { AddUpdateMentorProfessionalDetails } from '@/api/mentor/mentorProfileService';

interface ProfessionalExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience?: {
    id: string;
    company: string;
    designation: string;
    type: "fulltime" | "internship" | "parttime" | "contract" | "freelance";
    joiningDate: string;
    currentlyWorking: boolean;
    yearsOfExperience: number;
    areaOfExperience: string[];
    description?: string;
  } | null;
  existingExperiences?: Array<{
    id: string;
    currentlyWorking: boolean;
  }>;
  onUpdateSuccess: () => void;
}

// Helper function to convert date format from "Jan 2023" to "2023-01"
const convertDateForInput = (dateString: string) => {
  if (!dateString) return '';
  
  // If the date is already in YYYY-MM format, return as is
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Parse the date string like "Jan 2023"
  const parts = dateString.split(' ');
  if (parts.length !== 2) return '';
  
  const month = parts[0];
  const year = parts[1];
  
  // Convert month name to number (0-11)
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
  
  // Format as YYYY-MM
  return `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
};

export const ProfessionalExperienceModal: React.FC<ProfessionalExperienceModalProps> = ({
  isOpen,
  onClose,
  experience,
  existingExperiences = [],
  onUpdateSuccess,
}) => {
  // Initialize form state with default values
  const [formData, setFormData] = useState({
    company: '',
    designation: '',
    type: 'fulltime' as "fulltime" | "internship" | "parttime" | "contract" | "freelance",
    joiningDate: '',
    currentlyWorking: true,
    yearsOfExperience: '1',
    areaOfExperience: [] as string[],
    description: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newArea, setNewArea] = useState('');
  
  // Reset form when modal opens or when experience prop changes
  useEffect(() => {
    if (isOpen) {
      if (experience) {
        // Editing existing experience - populate with existing data
        setFormData({
          company: experience.company || '',
          designation: experience.designation || '',
          type: experience.type || 'fulltime',
          // Convert the date format for the input field
          joiningDate: convertDateForInput(experience.joiningDate),
          currentlyWorking: experience.currentlyWorking ?? true,
          yearsOfExperience: experience.yearsOfExperience?.toString() || '1',
          areaOfExperience: experience.areaOfExperience || [],
          description: experience.description || '',
        });
      } else {
        // Adding new experience - reset to default values
        setFormData({
          company: '',
          designation: '',
          type: 'fulltime',
          joiningDate: '',
          currentlyWorking: true,
          yearsOfExperience: '1',
          areaOfExperience: [],
          description: '',
        });
      }
      setNewArea('');
      setError(null);
    }
  }, [isOpen, experience]);
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };
  
  const addAreaOfExperience = () => {
    if (newArea.trim() && !formData.areaOfExperience.includes(newArea.trim())) {
      setFormData(prev => ({
        ...prev,
        areaOfExperience: [...prev.areaOfExperience, newArea.trim()]
      }));
      setNewArea('');
    }
  };
  
  const removeAreaOfExperience = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areaOfExperience: prev.areaOfExperience.filter(a => a !== area)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check if there's already a currently working experience
    if (formData.currentlyWorking) {
      const hasCurrentWorkingExperience = existingExperiences.some(
        exp => exp.currentlyWorking && exp.id !== experience?.id
      );
      
      if (hasCurrentWorkingExperience) {
        setError("You already have a 'Currently Working' experience. You can only have one current position at a time.");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      // Prepare data for API to match MentorProfessionEntity
      const updateData = {
        id: experience ? parseInt(experience.id) : 0, // Pass 0 for add, actual ID for update
        companyName: formData.company,
        designation: formData.designation,
        employmentType: formData.type,
        joiningDate: formData.joiningDate ? `${formData.joiningDate}-01` : '', // Format as YYYY-MM-01
        currentlyWorking: formData.currentlyWorking ? 1 : 0, // Convert boolean to integer
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        skills: formData.areaOfExperience.join(','), // Convert array to comma-separated string
        description: formData.description || null,
      };
      
      // Call the actual API
      const response = await AddUpdateMentorProfessionalDetails(updateData);
      
      if (response.success) {
        toast.success(experience ? 'Professional experience updated successfully!' : 'Professional experience added successfully!');
        onClose();
        onUpdateSuccess();
      } else {
        setError(response.message || "Failed to save professional experience");
        toast.error(response.message || "Failed to save professional experience");
      }
    } catch (err: any) {
      console.error('Error saving professional experience:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while saving your experience';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? 'Edit Professional Experience' : 'Add Professional Experience'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Employment Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fulltime">Full Time</SelectItem>
                  <SelectItem value="parttime">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input
                id="joiningDate"
                type="month"
                value={formData.joiningDate}
                onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentlyWorking">Currently Working</Label>
              <Select 
                value={formData.currentlyWorking ? 'true' : 'false'} 
                onValueChange={(value) => handleInputChange('currentlyWorking', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!formData.currentlyWorking && (
              <div className="space-y-2">
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Select 
                  value={formData.yearsOfExperience} 
                  onValueChange={(value) => handleInputChange('yearsOfExperience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year} {year === 1 ? 'year' : 'years'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Area of Experience</Label>
            <div className="flex gap-2">
              <Input
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Add area of expertise"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAreaOfExperience();
                  }
                }}
              />
              <Button type="button" onClick={addAreaOfExperience}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.areaOfExperience.map((area, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {area}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeAreaOfExperience(area)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your role and responsibilities"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : experience ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};