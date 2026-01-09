import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Calendar, Clock, Users, Info, Award } from "lucide-react";
import { MentorshipProgram } from "./types";
import { ProgramDetailsModal } from "./ProgramDetailsModal";

interface CompletedProgramsProps {
  programs: MentorshipProgram[];
}

export const CompletedPrograms: React.FC<CompletedProgramsProps> = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState<MentorshipProgram | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleViewDetails = (program: MentorshipProgram) => {
    setSelectedProgram(program);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      {programs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No completed programs</h3>
            <p className="text-muted-foreground">Completed mentorship programs will appear here</p>
          </CardContent>
        </Card>
      ) : (
        programs.map((program) => (
          <Card key={program.id} className="overflow-hidden">
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
                    <Badge className="bg-purple-100 text-purple-800">
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
              
              <Button
                variant="outline"
                onClick={() => handleViewDetails(program)}
              >
                <Info className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}
      
      <ProgramDetailsModal 
        program={selectedProgram} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        onAccept={() => {}}
        onDecline={() => {}}
      />
    </div>
  );
};