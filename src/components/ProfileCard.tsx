import { Github, Linkedin, ExternalLink, MapPin, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Student } from "../data/students";

interface ProfileCardProps {
  student: Student;
  showActions?: boolean;
  onViewProfile?: (studentId: string) => void;
  onSendInvite?: (studentId: string) => void;
  compact?: boolean;
}

export function ProfileCard({ 
  student, 
  showActions = true, 
  onViewProfile, 
  onSendInvite,
  compact = false 
}: ProfileCardProps) {
  
  const handleViewProfile = () => {
    onViewProfile?.(student.id);
  };

  const handleSendInvite = () => {
    onSendInvite?.(student.id);
  };

  if (compact) {
    return (
      <Card className="hover:shadow-card-hover transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{student.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{student.college}</p>
              <div className="flex items-center space-x-1 mt-1">
                {student.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {student.skills.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{student.skills.length - 2}
                  </span>
                )}
              </div>
            </div>
            {student.isVerified && (
              <div className="p-1 bg-success/10 rounded-full">
                <Star className="h-3 w-3 text-success fill-current" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.avatar} alt={student.name} />
            <AvatarFallback className="text-lg">{student.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {student.name}
              </h3>
              {student.isVerified && (
                <div className="p-1 bg-success/10 rounded-full">
                  <Star className="h-4 w-4 text-success fill-current" />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{student.college}</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{student.year}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {student.bio}
        </p>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {student.skills.slice(0, 6).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {student.skills.length > 6 && (
              <Badge variant="outline" className="text-xs">
                +{student.skills.length - 6} more
              </Badge>
            )}
          </div>
        </div>

        {/* Projects */}
        {student.projects.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Featured Project:</p>
            <div className="p-3 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">{student.projects[0].name}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {student.projects[0].description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {student.projects[0].technologies.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex items-center space-x-2">
          {student.githubUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={student.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
          {student.linkedinUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={student.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {student.portfolioUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={student.portfolioUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={handleSendInvite}
            >
              Send Invite
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}