// src/components/mentorshipManagement/ActiveProgramCard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Calendar, Clock, Users, ChevronDown, CheckSquare, MessageCircle } from "lucide-react";
import { TaskList } from "./TaskList";
import { UpdatesList } from "./UpdatesList";
import { StudentList } from "./StudentList";
import { Progress } from "@/components/ui/progress";
import { MentorshipProgram, Task, Update } from "./types";

interface ActiveProgramCardProps {
  program: MentorshipProgram;
}

export const ActiveProgramCard: React.FC<ActiveProgramCardProps> = ({ program }) => {
  const [expanded, setExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(program.tasks);
  const [updates, setUpdates] = useState<Update[]>(program.updates);
  
  const calculateTaskCompletion = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((task) => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    // In a real app, this would be an API call
    const newTask: Task = {
      ...taskData,
      id: `t${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, taskData: Omit<Task, "id">) => {
    // In a real app, this would be an API call
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...taskData } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    // In a real app, this would be an API call
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddUpdate = (updateData: Omit<Update, "id">) => {
    // In a real app, this would be an API call
    const newUpdate: Update = {
      ...updateData,
      id: `u${updates.length + 1}`,
    };
    setUpdates([...updates, newUpdate]);
  };

  const handleUpdateUpdate = (updateId: string, updateData: Omit<Update, "id">) => {
    // In a real app, this would be an API call
    setUpdates(updates.map(update => 
      update.id === updateId ? { ...update, ...updateData } : update
    ));
  };

  const handleDeleteUpdate = (updateId: string) => {
    // In a real app, this would be an API call
    setUpdates(updates.filter(update => update.id !== updateId));
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              {program.type === "skill" ? (
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              ) : (
                <Briefcase className="h-5 w-5 mr-2 text-purple-500" />
              )}
              <h2 className="text-xl font-bold">{program.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline">{program.domain}</Badge>
              <Badge variant="outline">{program.stack}</Badge>
              <Badge className={`${
                program.status === "active" 
                  ? "bg-blue-100 text-blue-800" 
                  : program.status === "completed" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-yellow-100 text-yellow-800"
              }`}>
                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{program.startDate} - {program.endDate}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock className="h-4 w-4 mr-1" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              <span>{program.numberOfStudents} students</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4">{program.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Task Completion</span>
            <span>{calculateTaskCompletion(tasks)}%</span>
          </div>
          <Progress value={calculateTaskCompletion(tasks)} className="h-2" />
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setExpanded(!expanded)}
          className="w-full"
        >
          {expanded ? "Show Less" : "Show Details"}
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {expanded && (
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-green-600" />
                Tasks
              </h3>
              <TaskList 
                tasks={tasks} 
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                Updates
              </h3>
              <UpdatesList 
                updates={updates} 
                onAddUpdate={handleAddUpdate}
                onUpdateUpdate={handleUpdateUpdate}
                onDeleteUpdate={handleDeleteUpdate}
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Students
              </h3>
              <StudentList students={program.students} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}