// src/components/mentor/MentorTypeSection.tsx
import React, { useState } from "react";
import {
  Edit,
  Plus,
  Trash2,
  Code,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ActiveInactiveMentorTypes } from "@/api/mentor/mentorProfileService";
import { AddUpdateMentorTypes } from "@/api/mentor/mentorProfileService";
import { DeleteMentorTypeDetails } from "@/api/mentor/mentorProfileService";
import MentorTypeDetailsModal from "@/components/models/mentor/MentorTypeDetailsModal";

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

interface MentorTypeSectionProps {
  mentorType: {
    skill: MentorTypeDetails;
    project: MentorTypeDetails;
  };
  onUpdateMentorType: (type: "skill" | "project", details: MentorTypeDetails) => void;
  refreshMentorData: () => void;
}

// Update the type for editingDomainStack to include domainStack
interface EditingDomainStack {
  type: "skill" | "project";
  index: number;
  domainStack: DomainStack;
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isDeleting?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isDeleting = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm">
            {message}
            {itemName && (
              <span className="font-medium text-foreground"> "{itemName}"</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MentorTypeSection: React.FC<MentorTypeSectionProps> = ({
  mentorType,
  onUpdateMentorType,
  refreshMentorData,
}) => {
  const [mentorTypeDetails, setMentorTypeDetails] = useState(mentorType);
  const [isMentorTypeModalOpen, setIsMentorTypeModalOpen] = useState(false);
  const [currentMentorType, setCurrentMentorType] = useState<"skill" | "project">("skill");
  // Update the state type to use the new interface
  const [editingDomainStack, setEditingDomainStack] = useState<EditingDomainStack | null>(null);
  const [isUpdatingMentorType, setIsUpdatingMentorType] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{
    type: string;
    id: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Domain-stack handlers
  const handleAddDomainStack = (type: "skill" | "project") => {
    setCurrentMentorType(type);
    setEditingDomainStack(null);
    setIsMentorTypeModalOpen(true);
  };

  const handleEditDomainStack = (type: "skill" | "project", index: number) => {
    setCurrentMentorType(type);
    const domainStack = mentorTypeDetails[type].domains[index];
    // Now we can properly set the state with the correct type
    setEditingDomainStack({ 
      type, 
      index,
      domainStack: {
        ...domainStack,
        // Ensure we have the domain and stack IDs if they exist
        domainId: domainStack.domainId || 0,
        stackId: domainStack.stackId || 0,
      }
    });
    setIsMentorTypeModalOpen(true);
  };

  const handleDeleteDomainStack = (type: "skill" | "project", index: number) => {
    const domainStack = mentorTypeDetails[type].domains[index];
    setDeleteConfig({
      type: `${type}DomainStack`,
      id: domainStack.id || index,
      name: `${domainStack.domain} - ${domainStack.stack}`,
    });
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfig) return;
    setIsDeleting(true);
    try {
      let response;
      
      if (deleteConfig.type === "skillDomainStack" || deleteConfig.type === "projectDomainStack") {
        // For domain-stack deletion, use the DeleteMentorTypeDetails service
        // We need the actual ID of the domain-stack record
        const mentorType = deleteConfig.type === "skillDomainStack" ? "skill" : "project";
        const domainStack = mentorTypeDetails[mentorType].domains.find(
          (ds, index) => index === deleteConfig.id || ds.id === deleteConfig.id
        );
        
        if (!domainStack || !domainStack.id) {
          throw new Error("Invalid domain-stack ID");
        }
        
        // Use the new DeleteMentorTypeDetails service
        response = await DeleteMentorTypeDetails(domainStack.id);
        
        if (response.success) {
          // Update local state - remove the deleted domain-stack
          const updatedDomains = mentorTypeDetails[mentorType].domains.filter(
            (ds, index) => !(index === deleteConfig.id || ds.id === deleteConfig.id)
          );
          
          const updatedDetails = {
            ...mentorTypeDetails,
            [mentorType]: {
              ...mentorTypeDetails[mentorType],
              domains: updatedDomains,
            },
          };
          
          setMentorTypeDetails(updatedDetails);
          onUpdateMentorType(mentorType, updatedDetails[mentorType]);
        }
      } else {
        throw new Error("Invalid delete type");
      }
      
      if (response.success) {
        toast.success(`${deleteConfig.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} deleted successfully`);
        refreshMentorData();
      } else {
        toast.error(
          response.message || `Failed to delete ${deleteConfig.type.replace(/([A-Z])/g, ' $1').toLowerCase()}`
        );
      }
    } catch (error) {
      console.error(`Error deleting ${deleteConfig.type}:`, error);
      toast.error(`An error occurred while deleting the ${deleteConfig.type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteConfig(null);
    }
  };

  // Handle mentor type toggle
  const handleMentorTypeToggle = async (
    type: "skill" | "project",
    active: boolean
  ) => {
    if (active) {
      // For activation, check if there are existing domains
      const hasDomains = mentorTypeDetails[type].domains.length > 0;
      
      if (hasDomains) {
        // If domains exist, activate the mentor type directly
        setIsUpdatingMentorType(true);
        try {
          // Pass mentor type as "skill" or "project" only
          const mentorTypeString = type;
          const response = await ActiveInactiveMentorTypes(mentorTypeString, 1); // 1 for active
          
          if (response.success) {
            // Update local state on success
            const updatedDetails = {
              ...mentorTypeDetails,
              [type]: {
                ...mentorTypeDetails[type],
                active: true,
              },
            };
            setMentorTypeDetails(updatedDetails);
            onUpdateMentorType(type, updatedDetails[type]);
            toast.success(
              `${
                type === "skill" ? "Skill" : "Project"
              } mentor type activated successfully`
            );
            // Refresh mentor data to get latest from server
            refreshMentorData();
          } else {
            // Revert toggle on failure
            toast.error(
              response.message || `Failed to activate ${type} mentor type`
            );
          }
        } catch (error) {
          console.error(`Error activating ${type} mentor type:`, error);
          toast.error(
            `An error occurred while activating the ${type} mentor type`
          );
        } finally {
          setIsUpdatingMentorType(false);
        }
      } else {
        // If no domains exist, open modal to add domain-stack
        const updatedDetails = {
          ...mentorTypeDetails,
          [type]: {
            ...mentorTypeDetails[type],
            active: true,
          },
        };
        setMentorTypeDetails(updatedDetails);
        setCurrentMentorType(type);
        setIsMentorTypeModalOpen(true);
      }
    } else {
      // For deactivation, use the API service
      setIsUpdatingMentorType(true);
      try {
        // Pass mentor type as "skill" or "project" only
        const mentorTypeString = type;
        const response = await ActiveInactiveMentorTypes(mentorTypeString, 0); // 0 for inactive
        
        if (response.success) {
          // Update local state on success
          const updatedDetails = {
            ...mentorTypeDetails,
            [type]: {
              ...mentorTypeDetails[type],
              active: false,
            },
          };
          setMentorTypeDetails(updatedDetails);
          onUpdateMentorType(type, updatedDetails[type]);
          toast.success(
            `${
              type === "skill" ? "Skill" : "Project"
            } mentor type deactivated successfully`
          );
          // Refresh mentor data to get latest from server
          refreshMentorData();
        } else {
          // Revert toggle on failure
          toast.error(
            response.message || `Failed to deactivate ${type} mentor type`
          );
        }
      } catch (error) {
        console.error(`Error deactivating ${type} mentor type:`, error);
        toast.error(
          `An error occurred while deactivating the ${type} mentor type`
        );
      } finally {
        setIsUpdatingMentorType(false);
      }
    }
  };

  // Handle details update
  const handleDetailsUpdate = (
    type: "skill" | "project",
    details: MentorTypeDetails
  ) => {
    const updatedDetails = {
      ...mentorTypeDetails,
      [type]: {
        ...details,
        // Preserve the ID if it exists
        id: mentorTypeDetails[type].id || 0,
      },
    };
    setMentorTypeDetails(updatedDetails);
    onUpdateMentorType(type, updatedDetails[type]);
  };

  return (
    <>
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 mb-6 md:mb-8">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Mentor Type</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className="space-y-6">
            {/* Skill Mentor Card */}
            <div className="p-4 rounded-lg border border-border/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Skill Mentor</h3>
                    <p className="text-sm text-muted-foreground">
                      Help students develop specific skills
                    </p>
                  </div>
                </div>
                <Switch
                  checked={mentorTypeDetails.skill.active}
                  onCheckedChange={(checked) =>
                    handleMentorTypeToggle("skill", checked)
                  }
                  disabled={isUpdatingMentorType}
                />
              </div>
              {mentorTypeDetails.skill.active && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Domains & Stacks</p>
                    {mentorTypeDetails.skill.domains.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {mentorTypeDetails.skill.domains.map((domainStack, index) => (
                          <div key={domainStack.id || index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                            <div>
                              <span className="font-medium">{domainStack.domain}</span>
                              <span className="text-muted-foreground"> - </span>
                              <span className="text-muted-foreground">{domainStack.stack}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditDomainStack("skill", index)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive"
                                onClick={() => handleDeleteDomainStack("skill", index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        No domains and stacks added
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddDomainStack("skill")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Domain & Stack
                  </Button>
                </div>
              )}
            </div>
            {/* Project Mentor Card */}
            <div className="p-4 rounded-lg border border-border/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Project Mentor</h3>
                    <p className="text-sm text-muted-foreground">
                      Guide students through projects
                    </p>
                  </div>
                </div>
                <Switch
                  checked={mentorTypeDetails.project.active}
                  onCheckedChange={(checked) =>
                    handleMentorTypeToggle("project", checked)
                  }
                  disabled={isUpdatingMentorType}
                />
              </div>
              {mentorTypeDetails.project.active && (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Domains & Stacks</p>
                    {mentorTypeDetails.project.domains.length > 0 ? (
                      <div className="space-y-2 mt-2">
                        {mentorTypeDetails.project.domains.map((domainStack, index) => (
                          <div key={domainStack.id || index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                            <div>
                              <span className="font-medium">{domainStack.domain}</span>
                              <span className="text-muted-foreground"> - </span>
                              <span className="text-muted-foreground">{domainStack.stack}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEditDomainStack("project", index)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive"
                                onClick={() => handleDeleteDomainStack("project", index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        No domains and stacks added
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddDomainStack("project")}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Domain & Stack
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Mentor Type Details Modal */}
      <MentorTypeDetailsModal
        isOpen={isMentorTypeModalOpen}
        onClose={() => setIsMentorTypeModalOpen(false)}
        type={currentMentorType}
        details={mentorTypeDetails[currentMentorType]}
        editingDomainStack={editingDomainStack ? {
          index: editingDomainStack.index,
          domainStack: editingDomainStack.domainStack
        } : null}
        onUpdateSuccess={handleDetailsUpdate}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfig(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${deleteConfig?.type || "Item"}`}
        message={`Are you sure you want to delete this ${
          deleteConfig?.type || "item"
        }? This action cannot be undone.`}
        itemName={deleteConfig?.name}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default MentorTypeSection;