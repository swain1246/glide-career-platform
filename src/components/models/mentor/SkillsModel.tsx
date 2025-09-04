import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { UpdateMentorSkills } from '@/api/mentor/mentorProfileService'; // Import the API service

interface SkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: string[];
  onUpdateSuccess: () => void;
}

export const SkillsModal: React.FC<SkillsModalProps> = ({
  isOpen,
  onClose,
  currentSkills,
  onUpdateSuccess,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentSkills);
  const [customSkill, setCustomSkill] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const predefinedSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express.js',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'Docker', 'AWS', 'Azure',
    'Machine Learning', 'Data Analysis', 'UI/UX Design', 'HTML/CSS',
    'TypeScript', 'Vue.js', 'Angular', 'Spring Boot', 'Django', 'Flask',
    'Kubernetes', 'Jenkins', 'GraphQL', 'Redis', 'Elasticsearch',
    'Cloud Architecture', 'Microservices', 'System Design', 'DevOps',
    'Software Architecture', 'Technical Leadership', 'Team Management',
    'Project Management', 'Agile Methodologies', 'Scrum', 'Mentoring'
  ];
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
    if (error) setError(null);
  };
  
  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };
  
  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert skills array to comma-separated string
      const skillsString = selectedSkills.join(',');
      
      // Log the data being sent for debugging
      console.log('Sending skills data:', skillsString);
      
      // Call the actual API
      const response = await UpdateMentorSkills(skillsString);
      
      if (response.success) {
        toast.success("Skills updated successfully");
        onClose();
        onUpdateSuccess();
      } else {
        setError(response.message || "Failed to update skills");
        toast.error(response.message || "Failed to update skills");
      }
    } catch (err: any) {
      console.error('Error updating skills:', err);
      // Log more details about the error
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        console.error('Error response headers:', err.response.headers);
      }
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while updating your skills';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            Update your skills by selecting from the predefined list or adding custom skills.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}
          
          {/* Selected Skills */}
          <div className="space-y-2">
            <Label>Selected Skills ({selectedSkills.length})</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg min-h-[60px] bg-muted/20">
              {selectedSkills.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-primary/30 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedSkills.length === 0 && (
                <p className="text-muted-foreground text-sm">No skills selected</p>
              )}
            </div>
          </div>
          
          {/* Add Custom Skill */}
          <div className="space-y-2">
            <Label>Add Custom Skill</Label>
            <div className="flex gap-2">
              <Input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter a skill not listed below"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
              />
              <Button type="button" onClick={addCustomSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Predefined Skills */}
          <div className="space-y-2">
            <Label>Select from Predefined Skills</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-lg">
              {predefinedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`p-2 text-sm rounded border text-left transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-border'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || selectedSkills.length === 0}>
              {isLoading ? 'Saving...' : 'Save Skills'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};