import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { Student } from "./types";
import { StudentProfileModal } from "./StudentProfileModal";

interface StudentListProps {
  students: Student[];
}

export const StudentList: React.FC<StudentListProps> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
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

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [students]);

  // Check if we have more than 4 students to show arrows
  const showArrows = students.length > 4;

  return (
    <div className="space-y-3">
      {students.length === 0 ? (
        <p className="text-muted-foreground text-sm">No students in this program</p>
      ) : (
        <div className="relative">
          {/* Top arrow - only show if there are more than 4 students and not at top */}
          {showArrows && showTopArrow && (
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
          
          {/* Bottom arrow - only show if there are more than 4 students and not at bottom */}
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
          
          {/* Scrollable students container with hidden scrollbar */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-hide"
          >
            {students.map((student) => (
              <div
                key={student.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewProfile(student)}
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={student.profileImage || undefined} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <StudentProfileModal 
        student={selectedStudent} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </div>
  );
}