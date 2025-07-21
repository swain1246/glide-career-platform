import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface SkillTagProps {
  skill: string;
  variant?: "default" | "secondary" | "outline";
  removable?: boolean;
  onRemove?: (skill: string) => void;
}

export function SkillTag({ skill, variant = "secondary", removable = false, onRemove }: SkillTagProps) {
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      {skill}
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-transparent"
          onClick={() => onRemove(skill)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
}