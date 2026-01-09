// src/components/mentorshipManagement/UpdatesList.tsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Update } from "./types";
import { Badge } from "@/components/ui/badge";
import { UpdateForm } from "./UpdateForm";

interface UpdatesListProps {
  updates: Update[];
  onAddUpdate: (update: Omit<Update, "id">) => void;
  onUpdateUpdate: (updateId: string, update: Omit<Update, "id">) => void;
  onDeleteUpdate: (updateId: string) => void;
}

export const UpdatesList: React.FC<UpdatesListProps> = ({ 
  updates, 
  onAddUpdate, 
  onUpdateUpdate, 
  onDeleteUpdate 
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sort updates by date (oldest first, newest last)
  const sortedUpdates = [...updates].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleAddUpdate = () => {
    setEditingUpdate(null);
    setIsFormOpen(true);
  };

  const handleEditUpdate = (update: Update) => {
    setEditingUpdate(update);
    setIsFormOpen(true);
  };

  const handleDeleteUpdate = (updateId: string) => {
    onDeleteUpdate(updateId);
  };

  const handleSaveUpdate = (updateData: Omit<Update, "id">) => {
    if (editingUpdate) {
      onUpdateUpdate(editingUpdate.id, updateData);
    } else {
      onAddUpdate(updateData);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUpdate(null);
  };

  // Scroll to bottom of the list (most recent updates)
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Scroll to top of the list (oldest updates)
  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
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

  // Set initial scroll position to bottom (most recent updates)
  useEffect(() => {
    scrollToBottom();
  }, [updates]);

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
  }, [updates]);

  // Check if we have more than 3 updates to show arrows
  const showArrows = updates.length > 3;

  return (
    <div className="space-y-4">
      {updates.length === 0 ? (
        <p className="text-muted-foreground text-sm">No updates yet</p>
      ) : (
        <div className="relative">
          {/* Top arrow - only show if there are more than 3 updates and not at top */}
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
          
          {/* Bottom arrow - only show if there are more than 3 updates and not at bottom */}
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
          
          {/* Scrollable updates container with hidden scrollbar */}
          <div 
            ref={scrollContainerRef}
            className="max-h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-hide"
          >
            {sortedUpdates.map((update) => (
              <div key={update.id} className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-indigo-900">{update.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs bg-indigo-100 text-indigo-800 border-indigo-200">
                      {update.forStudent}
                    </Badge>
                    <span className="text-xs text-indigo-700 bg-indigo-100 px-2 py-1 rounded">
                      {update.date}
                    </span>
                  </div>
                </div>
                <p className="text-indigo-800">{update.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Button
        variant="outline"
        onClick={handleAddUpdate}
        className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Update
      </Button>
      
      <UpdateForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveUpdate}
        update={editingUpdate}
      />
    </div>
  );
}