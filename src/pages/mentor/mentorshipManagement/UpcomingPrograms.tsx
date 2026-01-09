import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Briefcase, Calendar, Clock, Users, Info, ThumbsUp, ThumbsDown } from "lucide-react";
import { MentorshipProgram } from "./types";
import { ProgramDetailsModal } from "./ProgramDetailsModal";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UpcomingProgramsProps {
  programs: MentorshipProgram[];
}

export const UpcomingPrograms: React.FC<UpcomingProgramsProps> = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState<MentorshipProgram | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [isDeclining, setIsDeclining] = useState(false);
  const [declineProgramId, setDeclineProgramId] = useState<string | null>(null);

  const handleViewDetails = (program: MentorshipProgram) => {
    setSelectedProgram(program);
    setIsDetailsOpen(true);
  };

  const handleAccept = (programId: string) => {
    // In a real app, this would be an API call
    console.log(`Accepted program with ID: ${programId}`);
  };

  const handleDecline = (programId: string) => {
    setDeclineProgramId(programId);
    setIsDeclining(true);
  };

  const confirmDecline = () => {
    if (declineProgramId && declineReason) {
      // In a real app, this would be an API call
      console.log(`Declined program with ID: ${declineProgramId}, Reason: ${declineReason}`);
      setIsDeclining(false);
      setDeclineProgramId(null);
      setDeclineReason("");
    }
  };

  return (
    <div className="space-y-4">
      {programs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming programs</h3>
            <p className="text-muted-foreground">New mentorship programs will appear here</p>
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
                    <Badge className="bg-yellow-100 text-yellow-800">
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
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleViewDetails(program)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  onClick={() => handleAccept(program.id)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDecline(program.id)}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Decline
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      <ProgramDetailsModal 
        program={selectedProgram} 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      
      {/* Decline Modal */}
      <Dialog open={isDeclining} onOpenChange={setIsDeclining}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Program</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this mentorship program.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="decline-reason">Reason</Label>
              <Textarea
                id="decline-reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Enter reason for declining..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeclining(false);
                  setDeclineProgramId(null);
                  setDeclineReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDecline}
                disabled={!declineReason}
              >
                Confirm Decline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};