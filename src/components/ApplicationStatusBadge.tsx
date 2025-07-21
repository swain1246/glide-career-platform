import { Badge } from "./ui/badge";
import { CheckCircle, Clock, Calendar, XCircle, AlertCircle } from "lucide-react";

interface ApplicationStatusBadgeProps {
  status: "pending" | "reviewing" | "interview" | "accepted" | "rejected";
  showIcon?: boolean;
}

export function ApplicationStatusBadge({ status, showIcon = true }: ApplicationStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          variant: "default" as const,
          className: "bg-success text-success-foreground",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Accepted"
        };
      case "interview":
        return {
          variant: "default" as const,
          className: "bg-warning text-warning-foreground",
          icon: <Calendar className="h-3 w-3" />,
          label: "Interview"
        };
      case "reviewing":
        return {
          variant: "default" as const,
          className: "bg-primary text-primary-foreground",
          icon: <Clock className="h-3 w-3" />,
          label: "Reviewing"
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          className: "",
          icon: <XCircle className="h-3 w-3" />,
          label: "Rejected"
        };
      default:
        return {
          variant: "secondary" as const,
          className: "",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Pending"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${config.className}`}>
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}