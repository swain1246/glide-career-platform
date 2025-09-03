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
import { X } from 'lucide-react';

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
  onUpdateSuccess: () => void;
}

export const ProfessionalExperienceModal: React.FC<ProfessionalExperienceModalProps> = ({
  isOpen,
  onClose,
  experience,
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
          joiningDate: experience.joiningDate || '',
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
    
    try {
      // Prepare data for API
      const updateData = {
        company: formData.company,
        designation: formData.designation,
        type: formData.type,
        joiningDate: formData.joiningDate,
        currentlyWorking: formData.currentlyWorking,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        areaOfExperience: formData.areaOfExperience,
        description: formData.description,
      };
      
      // In a real app, you would call your API here
      // const response = experience 
      //   ? await UpdateMentorProfessionalExperience(experience.id, updateData)
      //   : await AddMentorProfessionalExperience(updateData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Close modal and notify parent to refresh data
      onClose();
      onUpdateSuccess();
    } catch (err: any) {
      console.error('Error saving professional experience:', err);
      setError(err.response?.data?.message || 'An error occurred while saving your experience');
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
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {error}
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