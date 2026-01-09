import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Briefcase, Calendar, Clock, Users, Award, ThumbsUp, ThumbsDown } from "lucide-react";
import { MentorshipProgram } from "./types";

interface ProgramDetailsModalProps {
  program: MentorshipProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (programId: string) => void;
  onDecline: (programId: string) => void;
}

export const ProgramDetailsModal: React.FC<ProgramDetailsModalProps> = ({ 
  program, 
  isOpen, 
  onClose,
  onAccept,
  onDecline
}) => {
  if (!program) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Program Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-2">{program.name}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
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
            <p className="text-muted-foreground">{program.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Duration</h4>
              <p className="text-muted-foreground">{program.duration}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Number of Students</h4>
              <p className="text-muted-foreground">{program.numberOfStudents}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Start Date</h4>
              <p className="text-muted-foreground">{program.startDate}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">End Date</h4>
              <p className="text-muted-foreground">{program.endDate}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              Students
            </h4>
            {program.students.length === 0 ? (
              <p className="text-muted-foreground">No students enrolled yet</p>
            ) : (
              <div className="space-y-3">
                {program.students.map((student) => (
                  <div key={student.id} className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={student.profileImage || undefined} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {program.status !== "completed" && (
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => onAccept(program.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="destructive"
                onClick={() => onDecline(program.id)}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Decline
              </Button>
            </div>
          )}
          
          {program.status === "completed" && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Program Summary
              </h4>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  This mentorship program was successfully completed on {program.endDate}. 
                  All {program.numberOfStudents} students successfully completed the program 
                  and gained valuable skills in {program.domain}.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};