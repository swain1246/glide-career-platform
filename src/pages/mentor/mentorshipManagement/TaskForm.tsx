// src/components/mentorshipManagement/TaskForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Task } from "./types";
import Drawer from "@/components/common/Drawer";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  task?: Task | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  task = null 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
  });

  const [errors, setErrors] = useState({
    title: false,
    description: false,
    dueDate: false,
    dueTime: false,
  });

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
      });
    } else {
      // Reset form when no task is provided (for adding new task)
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        dueTime: "",
      });
    }
    // Reset errors when form changes
    setErrors({
      title: false,
      description: false,
      dueDate: false,
      dueTime: false,
    });
  }, [task]);

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
      description: !formData.description.trim(),
      dueDate: !formData.dueDate,
      dueTime: !formData.dueTime,
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
        completed: task?.completed || false,
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
      title={task ? "Edit Task" : "Add New Task"}
    >
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title"
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">Task title is required</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="task-description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter task description"
              rows={3}
              className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">Description is required</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="task-date" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueDate ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="mt-1 text-sm text-red-600">Due date is required</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="task-time" className="block text-sm font-medium text-gray-700 mb-2">
                Due Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="task-time"
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleChange("dueTime", e.target.value)}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueTime ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dueTime && (
                <p className="mt-1 text-sm text-red-600">Due time is required</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {task ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};