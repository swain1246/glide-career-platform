// src/components/MentorshipRequestForm.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BindTechnicalStacks } from "@/api/commonService";
import { AddUpdateMentorshipRequest } from "@/api/student/mentorshipService";

const MENTORSHIP_TYPES = {
  SKILL: "skill",
  PROJECT: "project",
};

interface TechnicalStack {
  domainId: number;
  domainName: string;
  stackId: number;
  stackName: string;
}
interface Domain {
  id: number;
  name: string;
}
interface Stack {
  id: number;
  name: string;
}

interface MentorshipFormProps {
  mentorship?: {
    id: string;
    type: string;
    domain: string;
    domainId: number;
    stack: string;
    stackId: number;
    description: string;
  } | null;
  onSuccess: () => void;
  onClose: () => void;
}

const MentorshipRequestForm: React.FC<MentorshipFormProps> = ({
  mentorship,
  onSuccess,
  onClose,
}) => {
  const [mentorshipType, setMentorshipType] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedStack, setSelectedStack] = useState<Stack | null>(null);
  const [message, setMessage] = useState<string>("");

  const [filteredStacks, setFilteredStacks] = useState<Stack[]>([]);
  const [errors, setErrors] = useState({
    mentorshipType: false,
    domain: false,
    stack: false,
  });

  const [technicalStacks, setTechnicalStacks] = useState<TechnicalStack[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [stacksLoading, setStacksLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch technical stacks
  useEffect(() => {
    const fetchTechnicalStacks = async () => {
      try {
        setStacksLoading(true);
        const response = await BindTechnicalStacks();

        const uniqueDomainsMap = new Map<number, string>();
        response.data.forEach((item: TechnicalStack) => {
          uniqueDomainsMap.set(item.domainId, item.domainName);
        });

        const domainsArray: Domain[] = Array.from(
          uniqueDomainsMap,
          ([id, name]) => ({ id, name })
        );

        setTechnicalStacks(response.data);
        setDomains(domainsArray);
        setStacksLoading(false);
      } catch (error) {
        console.error("Error fetching technical stacks:", error);
        toast.error("Failed to load technical stacks. Please try again.");
        setStacksLoading(false);
      }
    };
    fetchTechnicalStacks();
  }, []);

  // Initialize form with mentorship data if editing
  useEffect(() => {
    if (mentorship) {
      setMentorshipType(mentorship.type);
      const domainObj = domains.find((d) => d.id === mentorship.domainId);
      setSelectedDomain(domainObj || null);
      setMessage(mentorship.description);
    } else {
      resetForm();
    }
  }, [mentorship, domains]);

  // Filter stacks when domain changes
  useEffect(() => {
    if (selectedDomain) {
      const domainId = selectedDomain.id;
      const stacksForDomain = technicalStacks
        .filter((stack) => stack.domainId === domainId)
        .map((stack) => ({ id: stack.stackId, name: stack.stackName }));
      setFilteredStacks(stacksForDomain);
    } else {
      setFilteredStacks([]);
      setSelectedStack(null);
    }
  }, [selectedDomain, technicalStacks]);

  // ✅ Fix: Ensure stack is prefilled when editing
  useEffect(() => {
    if (mentorship && mentorship.stackId && filteredStacks.length > 0) {
      const stackObj = filteredStacks.find((s) => s.id === mentorship.stackId);
      setSelectedStack(stackObj || null);
    }
  }, [mentorship, filteredStacks]);

  const resetForm = () => {
    setMentorshipType("");
    setSelectedDomain(null);
    setSelectedStack(null);
    setMessage("");
    setErrors({ mentorshipType: false, domain: false, stack: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      mentorshipType: !mentorshipType,
      domain: !selectedDomain,
      stack: !selectedStack,
    };
    setErrors(newErrors);
    if (newErrors.mentorshipType || newErrors.domain || newErrors.stack) return;

    try {
      setSubmitting(true);
      const requestData = {
        Id: mentorship ? parseInt(mentorship.id) : 0,
        StackId: selectedStack?.id || 0,
        DomainId: selectedDomain?.id || 0,
        MentorshipType: mentorshipType,
        Message: message,
      };
      await AddUpdateMentorshipRequest(requestData);
      toast.success(
        mentorship
          ? "Mentorship request updated successfully!"
          : "Mentorship request submitted successfully!"
      );
      onSuccess();
      resetForm();
    } catch (error: any) {
      console.error("Error submitting mentorship request:", error);
      toast.error(
        error.response?.data ||
          "Failed to update mentorship request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Mentorship Type */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Mentorship Type <span className="text-red-500">*</span>
        </label>
        <Select
          value={mentorshipType}
          onValueChange={(value) => {
            setMentorshipType(value);
            setErrors((prev) => ({ ...prev, mentorshipType: false }));
          }}
        >
          <SelectTrigger
            className={errors.mentorshipType ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={MENTORSHIP_TYPES.SKILL}>
              Skill Mentorship
            </SelectItem>
            <SelectItem value={MENTORSHIP_TYPES.PROJECT}>
              Project Mentorship
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.mentorshipType && (
          <p className="text-xs text-red-500 mt-1">
            Mentorship type is required
          </p>
        )}
      </div>

      {/* Domain */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Domain <span className="text-red-500">*</span>
        </label>
        {stacksLoading ? (
          <div className="flex items-center justify-center h-10 border rounded-md">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <Select
            value={selectedDomain?.id?.toString() || ""}
            onValueChange={(value) => {
              const domainId = parseInt(value);
              const domain = domains.find((d) => d.id === domainId);
              setSelectedDomain(domain || null);
              setErrors((prev) => ({ ...prev, domain: false, stack: false }));
            }}
          >
            <SelectTrigger className={errors.domain ? "border-red-500" : ""}>
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {domains.map((domain) => (
                <SelectItem key={domain.id} value={domain.id.toString()}>
                  {domain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {errors.domain && (
          <p className="text-xs text-red-500 mt-1">Domain is required</p>
        )}
      </div>

      {/* Stack */}
      {selectedDomain && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Stack <span className="text-red-500">*</span>
          </label>
          {stacksLoading ? (
            <div className="flex items-center justify-center h-10 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <Select
              value={selectedStack?.id?.toString() || ""}
              onValueChange={(value) => {
                const stackId = parseInt(value);
                const stack = filteredStacks.find((s) => s.id === stackId);
                setSelectedStack(stack || null);
                setErrors((prev) => ({ ...prev, stack: false }));
              }}
            >
              <SelectTrigger className={errors.stack ? "border-red-500" : ""}>
                <SelectValue placeholder="Select stack" />
              </SelectTrigger>
              <SelectContent>
                {filteredStacks.map((stack) => (
                  <SelectItem key={stack.id} value={stack.id.toString()}>
                    {stack.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {errors.stack && (
            <p className="text-xs text-red-500 mt-1">Stack is required</p>
          )}
        </div>
      )}

      {/* Message */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Message (Optional)
        </label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what you want to achieve"
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mentorship ? "Updating..." : "Submitting..."}
            </>
          ) : mentorship ? (
            "Update Request"
          ) : (
            "Submit Request"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MentorshipRequestForm;
