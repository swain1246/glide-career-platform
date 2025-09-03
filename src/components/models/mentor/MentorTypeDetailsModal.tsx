// First, let's create the external MentorTypeDetailsModal component
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MentorTypeDetails {
  active: boolean;
  preferredTime: string;
  skills: string[];
}

interface MentorTypeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "skill" | "project";
  details: MentorTypeDetails;
  onUpdateSuccess: (type: "skill" | "project", details: MentorTypeDetails) => void;
}

const MentorTypeDetailsModal: React.FC<MentorTypeDetailsModalProps> = ({
  isOpen,
  onClose,
  type,
  details,
  onUpdateSuccess,
}) => {
  const [preferredTime, setPreferredTime] = useState(details.preferredTime);
  const [skills, setSkills] = useState<string[]>([...details.skills]);
  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSuccess(type, {
      ...details,
      preferredTime,
      skills,
    });
    onClose();
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "skill" ? "Skill Mentor" : "Project Mentor"} Details
          </DialogTitle>
          <DialogDescription>
            Set your preferred time and skills for {type === "skill" ? "skill mentoring" : "project mentoring"}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="preferredTime" className="block text-sm font-medium mb-1">
              Preferred Time
            </Label>
            <Input
              id="preferredTime"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="e.g., Weekdays 6 PM - 9 PM"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-1">Skills</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
              />
              <Button type="button" onClick={addSkill} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                  <button
                    type="button"
                    className="ml-1 text-xs"
                    onClick={() => removeSkill(skill)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorTypeDetailsModal;