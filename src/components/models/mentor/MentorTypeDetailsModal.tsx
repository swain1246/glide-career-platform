// src/components/models/mentor/MentorTypeDetailsModal.tsx
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { AddUpdateMentorTypes } from "@/api/mentor/mentorProfileService";
import { BindTechnicalStacks } from "@/api/commonService";
import { cn } from "@/lib/utils"; // Import the cn utility for conditional class names

interface DomainStack {
  id?: number;
  domain: string;
  stack: string;
  domainId?: number;
  stackId?: number;
}

interface MentorTypeDetails {
  active: boolean;
  domains: DomainStack[];
  id?: number;
}

interface MentorTypeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "skill" | "project";
  details: MentorTypeDetails;
  editingDomainStack?: {
    index: number;
    domainStack: DomainStack;
  } | null;
  onUpdateSuccess: (type: "skill" | "project", details: MentorTypeDetails) => void;
}

interface TechnicalStack {
  domainId: number;
  domainName: string;
  stackId: number;
  stackName: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface MentorTypesEntity {
  Id: number;
  MentorType: string;
  DomainId: number;
  StackId: number;
  StackName: string;
}

const MentorTypeDetailsModal: React.FC<MentorTypeDetailsModalProps> = ({
  isOpen,
  onClose,
  type,
  details,
  editingDomainStack,
  onUpdateSuccess,
}) => {
  const [domain, setDomain] = useState("");
  const [stack, setStack] = useState("");
  const [customStack, setCustomStack] = useState("");
  const [isCustomStack, setIsCustomStack] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStacks, setIsFetchingStacks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [technicalStacks, setTechnicalStacks] = useState<TechnicalStack[]>([]);
  const [domains, setDomains] = useState<{ id: number; name: string }[]>([]);
  const [stacks, setStacks] = useState<{ id: number; name: string }[]>([]);
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedStackId, setSelectedStackId] = useState<number | null>(null);
  
  // Reset form state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      // Reset error state when modal opens
      setError(null);
      
      // Initialize form based on whether we're editing or adding
      if (editingDomainStack) {
        // If editing an existing domain-stack
        setDomain(editingDomainStack.domainStack.domain);
        setSelectedDomainId(editingDomainStack.domainStack.domainId || null);
        
        // Check if the existing stack is in our predefined list
        if (editingDomainStack.domainStack.stackId) {
          // Stack is predefined
          setStack(editingDomainStack.domainStack.stack);
          setSelectedStackId(editingDomainStack.domainStack.stackId);
          setIsCustomStack(false);
        } else {
          // Stack is custom
          setCustomStack(editingDomainStack.domainStack.stack);
          setIsCustomStack(true);
          setSelectedStackId(null);
        }
      } else {
        // If adding a new domain-stack
        setDomain("");
        setStack("");
        setCustomStack("");
        setSelectedDomainId(null);
        setSelectedStackId(null);
        setIsCustomStack(false);
      }
    }
  }, [isOpen, editingDomainStack]);
  
  // Fetch technical stacks when modal opens
  useEffect(() => {
    const fetchTechnicalStacks = async () => {
      if (isOpen) {
        setIsFetchingStacks(true);
        try {
          const response = await BindTechnicalStacks();
          if (response.success) {
            // Type assertion to ensure TypeScript knows the shape of the data
            const stacksData = (response.data as TechnicalStack[]) || [];
            setTechnicalStacks(stacksData);
            
            // Extract unique domains
            const uniqueDomains = Array.from(
              new Map(stacksData.map(item => [item.domainId, { id: item.domainId, name: item.domainName }])).values()
            );
            setDomains(uniqueDomains);
          } else {
            setError(response.message || "Failed to fetch technical stacks");
            toast.error(response.message || "Failed to fetch technical stacks");
          }
        } catch (err: any) {
          console.error('Error fetching technical stacks:', err);
          const errorMessage = err.response?.data?.message || err.message || 'An error occurred while fetching technical stacks';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setIsFetchingStacks(false);
        }
      }
    };
    fetchTechnicalStacks();
  }, [isOpen]);
  
  // Update stacks when domain changes
  useEffect(() => {
    if (domain) {
      const domainObj = domains.find(d => d.name === domain);
      if (domainObj) {
        setSelectedDomainId(domainObj.id);
        const domainStacks = technicalStacks
          .filter(item => item.domainId === domainObj.id)
          .map(item => ({ id: item.stackId, name: item.stackName }));
        setStacks(domainStacks);
      }
    } else {
      setSelectedDomainId(null);
      setStacks([]);
    }
  }, [domain, domains, technicalStacks]);
  
  // Handle domain change
  const handleDomainChange = (value: string) => {
    setDomain(value);
    // Reset stack when domain changes
    setStack("");
    setCustomStack("");
    setIsCustomStack(false);
    setSelectedStackId(null);
  };
  
  // Handle stack change
  const handleStackChange = (value: string) => {
    if (value === "custom") {
      setIsCustomStack(true);
      setStack("");
      setSelectedStackId(null);
    } else {
      setStack(value);
      setIsCustomStack(false);
      setCustomStack("");
      
      // Set the selected stack ID
      const stackObj = stacks.find(s => s.name === value);
      if (stackObj) {
        setSelectedStackId(stackObj.id);
      }
    }
  };
  
  // Handle custom stack input change
  const handleCustomStackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomStack(e.target.value);
  };
  
  // Handle switching back from custom to predefined
  const handleSwitchToPredefined = () => {
    setIsCustomStack(false);
    setCustomStack("");
  };
  
  // Handle modal close
  const handleModalClose = () => {
    // Reset all form states
    setError(null);
    setDomain("");
    setStack("");
    setCustomStack("");
    setIsCustomStack(false);
    setSelectedDomainId(null);
    setSelectedStackId(null);
    onClose();
  };
  
  // Add or update domain-stack
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate that we have a stack value
      const stackValue = isCustomStack ? customStack : stack;
      if (!domain || !stackValue) {
        setError("Please select a domain and enter a stack");
        setIsLoading(false);
        return;
      }
      
      // Prepare data for API according to MentorTypesEntity
      // Use only "skill" or "project" for MentorType field
      const mentorTypeString = type; // This will be either "skill" or "project"
      
      // Create the data object for the current domain-stack pair only
      const currentDomainStack = {
        Id: editingDomainStack && editingDomainStack.domainStack.id ? editingDomainStack.domainStack.id : 0, // Use 0 for adding, actual ID for updating
        MentorType: mentorTypeString, // Use just "skill" or "project"
        DomainId: selectedDomainId || 0,
        StackId: isCustomStack ? 0 : (selectedStackId || 0), // 0 for custom stacks
        StackName: stackValue
      };
      
      // Send only the current domain-stack pair
      const response = await AddUpdateMentorTypes(currentDomainStack);
      console.log(response)
      
      if (!response.success) {
        setError( response.message || "Failed to update mentor type details");
        // toast.error( response.message || "Failed to update mentor type details");
        setIsLoading(false);
        return;
      }
      
      // Create updated domains array for local state
      let updatedDomains: DomainStack[];
      
      if (editingDomainStack) {
        // Update existing domain-stack
        updatedDomains = [...details.domains];
        updatedDomains[editingDomainStack.index] = {
          ...updatedDomains[editingDomainStack.index],
          domain,
          stack: stackValue,
          domainId: selectedDomainId || undefined,
          stackId: isCustomStack ? undefined : selectedStackId,
          id: response.data?.Id || editingDomainStack.domainStack.id, // Update the ID with the response if available
        };
      } else {
        // Add new domain-stack
        updatedDomains = [...details.domains, { 
          domain, 
          stack: stackValue,
          domainId: selectedDomainId || undefined,
          stackId: isCustomStack ? undefined : selectedStackId,
          id: response.data?.Id // Use the ID returned from the API
        }];
      }
      
      toast.success(`${mentorTypeString} mentor details updated successfully`);
      onUpdateSuccess(type, {
        ...details,
        domains: updatedDomains,
        active: true, // Ensure active is set to true
      });
      handleModalClose(); // Use our custom close function to reset states
    } catch (err: any) {
      console.error('Error updating mentor type details:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred while updating mentor type details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "skill" ? "Skill Mentor" : "Project Mentor"} Details
          </DialogTitle>
          <DialogDescription>
            {editingDomainStack ? "Update" : "Add"} domain and stack for {type === "skill" ? "skill mentoring" : "project mentoring"}.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {isFetchingStacks ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm">Loading domains and stacks...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1">
                Domain
              </Label>
              <Select value={domain} onValueChange={handleDomainChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto scrollbar-hide">
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.name}>
                      {domain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {domain && (
              <div>
                <Label className="block text-sm font-medium mb-1">
                  Stack
                </Label>
                {isCustomStack ? (
                  <div className="space-y-2">
                    <Input
                      value={customStack}
                      onChange={handleCustomStackChange}
                      placeholder="Enter custom stack name"
                      className="w-full"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSwitchToPredefined}
                      className="w-full"
                    >
                      ← Back to predefined stacks
                    </Button>
                  </div>
                ) : (
                  <Select value={stack} onValueChange={handleStackChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a stack" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto scrollbar-hide">
                      {stacks.map((stack) => (
                        <SelectItem key={stack.id} value={stack.name}>
                          {stack.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">+ Custom Stack</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleModalClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !domain || (!stack && !customStack) || (isCustomStack && !customStack.trim())}
              >
                {isLoading ? 'Saving...' : (editingDomainStack ? 'Update' : 'Add')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MentorTypeDetailsModal;