import { MapPin, Clock, DollarSign, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Job } from "../data/jobs";

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
}

export function JobCard({ job, showApplyButton = true, onApply, onViewDetails }: JobCardProps) {
  const handleApply = () => {
    onApply?.(job.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(job.id);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Remote": return "bg-success/10 text-success border-success/20";
      case "Hybrid": return "bg-primary/10 text-primary border-primary/20";
      case "On-site": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-secondary";
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={job.companyLogo} alt={job.companyName} />
              <AvatarFallback>{job.companyName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-muted-foreground">{job.companyName}</p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getTypeColor(job.type)}
          >
            {job.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Job details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{job.stipend}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.duration}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{job.applicants} applicants</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Required Skills:</p>
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {/* Deadline */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Deadline:</span>
          <span className={formatDeadline(job.deadline).includes("day") ? "text-warning" : "text-destructive"}>
            {formatDeadline(job.deadline)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          {showApplyButton && job.status === "Open" && (
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={handleApply}
            >
              Apply Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}