import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Plus,
  X
} from "lucide-react";
import { toast } from "sonner";
import { AddUpdateMentorTypes } from "@/api/mentor/mentorProfileService";

interface MentorTypeDetails {
  active: boolean;
  preferredTime: string;
  skills: string[];
  id?: number; // Added ID field to track mentor type ID
}

interface MentorTypeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "skill" | "project";
  details: MentorTypeDetails;
  onUpdateSuccess: (type: "skill" | "project", details: MentorTypeDetails) => void;
}

// Define the type for custom time fields
type CustomTimeFields = {
  days: string;
  startTime: string;
  endTime: string;
};

// Define the keys of CustomTimeFields
type CustomTimeFieldKeys = keyof CustomTimeFields;

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
  const [timeSlot, setTimeSlot] = useState("custom");
  const [customTime, setCustomTime] = useState<CustomTimeFields>({
    days: "",
    startTime: "",
    endTime: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentorTypeId, setMentorTypeId] = useState<number>(details.id || 0); // Initialize with existing ID or 0

  // Predefined time slots
  const predefinedTimeSlots = [
    "Weekdays 6 PM - 9 PM",
    "Weekdays 9 AM - 12 PM",
    "Weekends 10 AM - 2 PM",
    "Weekends 2 PM - 6 PM",
    "Flexible",
    "Weekday evenings",
    "Weekend mornings"
  ];

  // Days of the week
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

  // Initialize form when modal opens or details change
  useEffect(() => {
    if (isOpen) {
      setPreferredTime(details.preferredTime);
      setSkills([...details.skills]);
      setNewSkill("");
      setMentorTypeId(details.id || 0); // Set mentorTypeId from details
      
      // Try to determine if we're using a predefined slot or custom time
      const isPredefined = predefinedTimeSlots.includes(details.preferredTime);
      setTimeSlot(isPredefined ? details.preferredTime : "custom");
      
      // If it's a custom time, try to parse it
      if (!isPredefined && details.preferredTime) {
        // Try to parse format like "Monday, Tuesday 6:00 PM - 9:00 PM"
        const timeRegex = /^(.+?)\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)$/;
        const match = details.preferredTime.match(timeRegex);
        
        if (match) {
          setCustomTime({
            days: match[1],
            startTime: match[2],
            endTime: match[3]
          });
        }
      }
    }
  }, [isOpen, details]);

  // Handle time slot selection
  const handleTimeSlotChange = (value: string) => {
    setTimeSlot(value);
    if (value !== "custom") {
      setPreferredTime(value);
    }
  };

  // Updated version of handleCustomTimeChange
  const handleCustomTimeChange = (field: CustomTimeFieldKeys, value: string) => {
    setCustomTime(prev => {
      const updated: CustomTimeFields = { ...prev, [field]: value };
      if (updated.days && updated.startTime && updated.endTime) {
        setPreferredTime(`${updated.days} ${updated.startTime} - ${updated.endTime}`);
      }
      return updated;
    });
  };

  // Add multiple days
  const handleDayToggle = (day: string) => {
    const currentDays = customTime.days.split(", ").filter(d => d);
    if (currentDays.includes(day)) {
      const updatedDays = currentDays.filter(d => d !== day).join(", ");
      handleCustomTimeChange("days", updatedDays);
    } else {
      const updatedDays = [...currentDays, day].join(", ");
      handleCustomTimeChange("days", updatedDays);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepare data for API - match the MentorTypesEntity structure
      const mentorTypeString = type === "skill" ? "skill Mentor" : "project Mentor";
      const skillsString = skills.join(",");
      
      // Use the existing mentorTypeId if available, otherwise 0 for new record
      const updateData = {
        id: mentorTypeId,
        mentorType: mentorTypeString,
        isActive: 1, // Always 1 when saving through this modal (since we're enabling/activating)
        preferredTime,
        skillsStacks: skillsString,
      };
      
      // Call the actual API
      const response = await AddUpdateMentorTypes(updateData);
      
      if (response.success) {
        // If this was a new record, update the mentorTypeId with the returned ID
        const newId = response.data?.Id || mentorTypeId;
        
        toast.success(`${mentorTypeString} details updated successfully`);
        onUpdateSuccess(type, {
          ...details,
          preferredTime,
          skills,
          id: newId, // Update the ID in the details
          active: true, // Ensure active is set to true
        });
        onClose();
      } else {
        setError(response.message || "Failed to update mentor type details");
        toast.error(response.message || "Failed to update mentor type details");
      }
    } catch (err: any) {
      console.error('Error updating mentor type details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while updating mentor type details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-1">
              Preferred Time
            </Label>
            
            <Select value={timeSlot} onValueChange={handleTimeSlotChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a time slot" />
              </SelectTrigger>
              <SelectContent>
                {predefinedTimeSlots.map((slot, index) => (
                  <SelectItem key={index} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Time</SelectItem>
              </SelectContent>
            </Select>
            
            {timeSlot === "custom" && (
              <div className="mt-3 space-y-3 p-3 bg-muted rounded-md">
                <div>
                  <Label className="text-xs font-medium">Days</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {daysOfWeek.map(day => (
                      <Button
                        key={day}
                        type="button"
                        variant={customTime.days.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleDayToggle(day)}
                        className="text-xs h-7"
                      >
                        {day.substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium">Start Time</Label>
                    <Input
                      type="time"
                      value={customTime.startTime}
                      onChange={(e) => handleCustomTimeChange("startTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">End Time</Label>
                    <Input
                      type="time"
                      value={customTime.endTime}
                      onChange={(e) => handleCustomTimeChange("endTime", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                {preferredTime && (
                  <div className="mt-2 text-xs">
                    <span className="font-medium">Selected: </span>
                    {preferredTime}
                  </div>
                )}
              </div>
            )}
            
            {timeSlot !== "custom" && (
              <div className="mt-2 text-sm text-muted-foreground">
                {preferredTime}
              </div>
            )}
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
                <Plus className="h-4 w-4" />
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
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || skills.length === 0}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MentorTypeDetailsModal;