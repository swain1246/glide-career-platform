// src/components/mentorshipManagement/TaskList.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Calendar, Edit, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Task } from "./types";
import { TaskForm } from "./TaskForm";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onUpdateTask: (taskId: string, task: Omit<Task, "id">) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sort tasks by due date (ascending) - this will be the natural order
  const sortedTasks = [...tasks].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
  };

  const handleSaveTask = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Scroll to top of the list
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  // Scroll to bottom of the list
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Handle scroll events to show/hide arrows
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      
      // Show top arrow if not at the top
      setShowTopArrow(scrollTop > 0);
      
      // Show bottom arrow if not at the bottom
      setShowBottomArrow(scrollTop + clientHeight < scrollHeight - 1);
    }
  };

  // Set initial scroll position to show the first completed task (if any) and then active tasks
  useEffect(() => {
    if (scrollContainerRef.current) {
      // Find the first completed task
      const firstCompletedIndex = sortedTasks.findIndex(task => task.completed);
      
      if (firstCompletedIndex !== -1) {
        // If there's a completed task, scroll to it
        const completedTaskElement = scrollContainerRef.current.children[firstCompletedIndex] as HTMLElement;
        if (completedTaskElement) {
          scrollContainerRef.current.scrollTop = completedTaskElement.offsetTop;
        }
      } else {
        // If no completed tasks, scroll to the top
        scrollContainerRef.current.scrollTop = 0;
      }
      
      // Initial check for arrow visibility
      handleScroll();
    }
  }, [tasks]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [tasks]);

  // Check if we have tasks to show
  const hasTasks = tasks.length > 0;
  
  // Check if we have more than 3 tasks to show the bottom arrow
  const showArrows = tasks.length > 3;

  // Desktop View
  const DesktopTaskList = () => (
    <div className="hidden md:block space-y-3">
      {tasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tasks assigned yet</p>
      ) : (
        <div className="relative">
          {/* Top arrow - always show if there are tasks and not at top */}
          {hasTasks && showTopArrow && (
            <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="bg-white border border-gray-200 shadow-md rounded-full w-8 h-8 p-0"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Bottom arrow - only show if there are more than 3 tasks and not at bottom */}
          {showArrows && showBottomArrow && (
            <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToBottom}
                className="bg-white border border-gray-200 shadow-md rounded-full w-8 h-8 p-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Scrollable task container with hidden scrollbar */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-hide"
          >
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border-l-4 ${task.completed ? "bg-green-50 border-green-500" : "bg-white border-blue-500 shadow-sm"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div
                      className={`flex items-center justify-center h-6 w-6 rounded-full border mr-3 mt-0.5 flex-shrink-0 ${
                        task.completed ? "bg-green-500 border-green-500" : "border-blue-500"
                      }`}
                    >
                      {task.completed && <CheckSquare className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-gray-900"}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{task.dueDate} at {task.dueTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      disabled={task.completed}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={task.completed}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button
        variant="outline"
        onClick={handleAddTask}
        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Task
      </Button>
    </div>
  );

  // Mobile View
  const MobileTaskList = () => (
    <div className="md:hidden">
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks assigned yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Navigation Arrows */}
          <div className="flex justify-between items-center mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToTop}
              disabled={!showTopArrow}
              className={`p-2 rounded-full ${showTopArrow ? 'bg-white border border-gray-200 shadow' : 'bg-transparent'}`}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {tasks.filter(t => t.completed).length} of {tasks.length} completed
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={scrollToBottom}
              disabled={!showBottomArrow}
              className={`p-2 rounded-full ${showBottomArrow ? 'bg-white border border-gray-200 shadow' : 'bg-transparent'}`}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile Scrollable Task Container */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[400px] overflow-y-auto pb-2 scrollbar-hide"
          >
            {sortedTasks.map((task, index) => (
              <div
                key={task.id}
                className={`mb-3 p-4 rounded-xl shadow-sm ${task.completed ? 'bg-green-50 border border-green-200' : 'bg-white border border-gray-200'}`}
              >
                <div className="flex items-start">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full border mr-3 flex-shrink-0 ${
                      task.completed ? "bg-green-500 border-green-500" : "border-blue-500"
                    }`}
                  >
                    {task.completed && <CheckSquare className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <p
                          className={`font-medium truncate ${task.completed ? "line-through text-muted-foreground" : "text-gray-900"}`}
                        >
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{task.dueDate} at {task.dueTime}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          disabled={task.completed}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={task.completed}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Add Task Button */}
          <Button
            onClick={handleAddTask}
            className="w-full py-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 flex items-center justify-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="font-medium">Add New Task</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <DesktopTaskList />
      <MobileTaskList />
      
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}