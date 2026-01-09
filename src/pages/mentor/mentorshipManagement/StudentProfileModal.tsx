import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Code, FileText } from "lucide-react";
import { Student } from "./types";

interface StudentProfileModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ 
  student, 
  isOpen, 
  onClose 
}) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={student.profileImage || undefined} />
              <AvatarFallback className="text-lg">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="text-muted-foreground">{student.email}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
              Education
            </h4>
            <div className="space-y-2">
              {student.education.map((edu, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">Year: {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-purple-500" />
              Experience
            </h4>
            <div className="space-y-2">
              {student.experience.map((exp, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.duration}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Code className="h-5 w-5 mr-2 text-green-500" />
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-yellow-500" />
              Projects
            </h4>
            <div className="space-y-3">
              {student.projects.map((project, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};