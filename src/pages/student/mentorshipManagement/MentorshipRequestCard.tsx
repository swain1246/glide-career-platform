import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Briefcase, Target, Edit, CheckCircle, Trash2 } from "lucide-react";

// Mentorship type mapping
const MENTORSHIP_TYPES = {
  SKILL: "skill",
  PROJECT: "project",
};

// Status badge colors
const STATUS_BADGE_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-blue-100 text-blue-800",
  completed: "bg-purple-100 text-purple-800",
};

interface Mentorship {
  id: string;
  type: string;
  domain: string;
  domainId: number;
  stack: string;
  stackId: number;
  area: string;
  description: string;
  status: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    profileImage: string | null;
  } | null;
  startDate: string | null;
  endDate?: string;
  tasks: any[];
  updates: any[];
}

interface MentorshipCardProps {
  mentorship: Mentorship;
  onEdit?: (mentorship: Mentorship) => void;
  onViewDetails?: (mentorship: Mentorship) => void;
  onWithdraw?: (mentorship: Mentorship) => void;
  showEditButton?: boolean;
  showViewDetailsButton?: boolean;
  showWithdrawButton?: boolean;
}

const MentorshipRequestCard: React.FC<MentorshipCardProps> = ({
  mentorship,
  onEdit,
  onViewDetails,
  onWithdraw,
  showEditButton = false,
  showViewDetailsButton = false,
  showWithdrawButton = false,
}) => {
  // Get status badge
  const getStatusBadge = (status: string) => {
    const colorClass =
      STATUS_BADGE_COLORS[status as keyof typeof STATUS_BADGE_COLORS];
    return (
      <Badge className={colorClass}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get mentorship type icon
  const getMentorshipTypeIcon = (type: string) => {
    switch (type) {
      case MENTORSHIP_TYPES.SKILL:
        return <BookOpen className="h-4 w-4" />;
      case MENTORSHIP_TYPES.PROJECT:
        return <Briefcase className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  // Get mentorship type name - Convert "skill" to "Skill Mentorship" and "project" to "Project Mentorship"
  const getMentorshipTypeName = (type: string) => {
    return type === MENTORSHIP_TYPES.SKILL
      ? "Skill Mentorship"
      : "Project Mentorship";
  };

  return (
    <Card className="hover:shadow-md transition-shadow w-full">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left Column - Content */}
          <div className="flex-1 min-w-0">
            {/* Header with type and status */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex items-center">
                {getMentorshipTypeIcon(mentorship.type)}
                <span className="ml-2 font-medium text-sm sm:text-base">
                  {getMentorshipTypeName(mentorship.type)}
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm sm:text-base truncate">{mentorship.area}</span>
            </div>
            
            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {mentorship.description}
            </p>
            
            {/* Mentor Info */}
            <div className="flex items-center text-sm mb-3">
              {mentorship.mentor ? (
                <>
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage
                      src={mentorship.mentor.profileImage || undefined}
                    />
                    <AvatarFallback>
                      {mentorship.mentor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{mentorship.mentor.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">No mentor assigned yet</span>
              )}
            </div>
            
            {/* Dates - Only show on larger screens or when completed */}
            <div className="hidden sm:flex flex-wrap gap-4 text-xs text-muted-foreground">
              {mentorship.startDate && (
                <div>Started: {mentorship.startDate}</div>
              )}
              {mentorship.endDate && (
                <div>Completed: {mentorship.endDate}</div>
              )}
            </div>
          </div>
          
          {/* Right Column - Status and Actions */}
          <div className="flex flex-col items-start sm:items-end gap-3 sm:min-w-[120px]">
            {/* Status Badge */}
            {getStatusBadge(mentorship.status)}
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {showEditButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit && onEdit(mentorship)}
                  className="flex-1 sm:flex-none"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  <span>Edit</span>
                </Button>
              )}
              {showWithdrawButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWithdraw && onWithdraw(mentorship)}
                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span>Withdraw</span>
                </Button>
              )}
              {showViewDetailsButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails && onViewDetails(mentorship)}
                  className="flex-1 sm:flex-none"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>View</span>
                </Button>
              )}
            </div>
            
            {/* Mobile Dates */}
            <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:hidden w-full">
              {mentorship.startDate && (
                <div>Started: {mentorship.startDate}</div>
              )}
              {mentorship.endDate && (
                <div>Completed: {mentorship.endDate}</div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorshipRequestCard;