// src/components/mentorshipManagement/UpdateForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Update } from "./types";
import Drawer from "@/components/common/Drawer";

interface UpdateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (update: Omit<Update, "id">) => void;
  update?: Update | null;
}

export const UpdateForm: React.FC<UpdateFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  update = null 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    forStudent: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    content: false,
    forStudent: false,
  });

  // Update form data when update prop changes
  useEffect(() => {
    if (update) {
      setFormData({
        title: update.title,
        content: update.content,
        forStudent: update.forStudent,
      });
    } else {
      // Reset form when no update is provided (for adding new update)
      setFormData({
        title: "",
        content: "",
        forStudent: "",
      });
    }
    // Reset errors when form changes
    setErrors({
      title: false,
      content: false,
      forStudent: false,
    });
  }, [update]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: !formData.title.trim(),
      content: !formData.content.trim(),
      forStudent: !formData.forStudent.trim(),
    };
    
    setErrors(newErrors);
    
    // Return true if no errors
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        date: update?.date || new Date().toISOString().split('T')[0], // Use current date if not editing
      });
      onClose();
    }
  };

  return (
    <Drawer
      isFlexible={false}
      maxWidth="400px"
      width="400px"
      isOpen={isOpen}
      onClose={onClose}
      title={update ? "Edit Update" : "Add New Update"}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="update-title" className="block text-sm font-medium text-gray-700 mb-2">
              Update Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="update-title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter update title"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">Update title is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="update-content" className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="update-content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter update content"
              rows={4}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.content ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">Content is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="update-student" className="block text-sm font-medium text-gray-700 mb-2">
              For Student <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.forStudent}
              onValueChange={(value) => handleChange("forStudent", value)}
            >
              <SelectTrigger 
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.forStudent ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              >
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Students">All Students</SelectItem>
                <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                <SelectItem value="Sam Smith">Sam Smith</SelectItem>
                <SelectItem value="Taylor Brown">Taylor Brown</SelectItem>
              </SelectContent>
            </Select>
            {errors.forStudent && (
              <p className="mt-1 text-sm text-red-600">Please select a student</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {update ? "Update Update" : "Add Update"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};