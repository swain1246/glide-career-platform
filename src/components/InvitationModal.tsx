import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { SkillTag } from "./SkillTag";

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "send" | "receive";
  mentor?: {
    name: string;
    avatar: string;
    title: string;
    skills: string[];
    bio: string;
  };
  student?: {
    name: string;
    avatar: string;
    college: string;
    skills: string[];
  };
  onAction: (action: "accept" | "reject" | "send", notes?: string) => void;
}

export function InvitationModal({ isOpen, onClose, type, mentor, student, onAction }: InvitationModalProps) {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: "accept" | "reject" | "send") => {
    setIsLoading(true);
    await onAction(action, notes);
    setIsLoading(false);
    onClose();
    setNotes("");
  };

  const profileData = type === "receive" ? mentor : student;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "send" ? "Send Mentorship Invitation" : "Mentorship Invitation"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Profile Info */}
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={profileData?.avatar} />
              <AvatarFallback>{profileData?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{profileData?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {type === "receive" ? mentor?.title : student?.college}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profileData?.skills?.slice(0, 6).map((skill) => (
                <SkillTag key={skill} skill={skill} variant="secondary" />
              ))}
            </div>
          </div>

          {/* Bio/Description */}
          {type === "receive" && mentor?.bio && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">About</p>
              <p className="text-sm text-muted-foreground">{mentor.bio}</p>
            </div>
          )}

          {/* Notes Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {type === "send" ? "Invitation Message" : "Response Notes"} (Optional)
            </label>
            <Textarea
              placeholder={
                type === "send"
                  ? "Hi! I'd love to mentor you in..."
                  : "Thank you for the invitation..."
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {type === "send" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleAction("send")}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {isLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => handleAction("reject")}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Decline"}
              </Button>
              <Button 
                onClick={() => handleAction("accept")}
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {isLoading ? "Processing..." : "Accept"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}