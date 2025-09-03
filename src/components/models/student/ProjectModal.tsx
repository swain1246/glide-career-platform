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
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { AddUpdateStudentProject } from '@/api/studentServices'; // Import the API service

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    links: string[];
    projectDuration: number;
  };
  onUpdateSuccess?: () => void; // Added callback for successful update
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectDuration: '',
    description: '',
    skills: [] as string[],
    projectUrl: '',
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to populate form when project changes
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.title || '',
        projectDuration: project.projectDuration?.toString() || '',
        description: project.description || '',
        skills: project.techStack || [],
        projectUrl: project.links?.[0] || '', // Only use the first link
      });
    } else {
      // Reset form when adding new project
      setFormData({
        projectName: '',
        projectDuration: '',
        description: '',
        skills: [],
        projectUrl: '',
      });
    }
  }, [project]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data according to StudentProjectEntity
      const projectData = {
        Id: project ? parseInt(project.id) : 0, // 0 for new projects
        ProjectName: formData.projectName,
        ProjectDuration: parseInt(formData.projectDuration) || 0,
        Description: formData.description || null,
        Skills: formData.skills.join(', '),
        ProjectUrl: formData.projectUrl || null,
      };
      
      console.log("Submitting project data:", projectData);
      
      // Call API service
      await AddUpdateStudentProject(projectData);
      
      // Trigger success callback if provided
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      // Handle error (show toast message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              placeholder="e.g., E-commerce Website"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectDuration">Project Duration (months)</Label>
            <Input
              id="projectDuration"
              type="number"
              min="1"
              value={formData.projectDuration}
              onChange={(e) => handleInputChange('projectDuration', e.target.value)}
              placeholder="e.g., 3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project, its features, and your role"
              rows={4}
            />
          </div>
          
          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add skill (e.g., React)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="flex items-center gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Project URL */}
          <div className="space-y-2">
            <Label htmlFor="projectUrl">Project URL</Label>
            <Input
              id="projectUrl"
              value={formData.projectUrl}
              onChange={(e) => handleInputChange('projectUrl', e.target.value)}
              placeholder="https://github.com/username/project"
              type="url"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (project ? 'Update' : 'Add') + ' Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};