import { useState } from "react";
import { ArrowLeft, Upload, Github, Linkedin, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function EditProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    college: "Stanford University",
    major: "Computer Science",
    year: "3rd Year",
    bio: "Passionate computer science student with experience in full-stack development and machine learning.",
    skills: ["React", "Python", "JavaScript", "Machine Learning", "Node.js"],
    github: "https://github.com/alexjohnson",
    linkedin: "https://linkedin.com/in/alexjohnson",
    portfolio: "https://alexjohnson.dev",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  });

  const [newSkill, setNewSkill] = useState("");

  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [
      profileData.name,
      profileData.college,
      profileData.major,
      profileData.bio,
      profileData.skills.length > 0,
      profileData.github,
      profileData.linkedin,
      profileData.phone
    ];
    
    const completedFields = fields.filter(field => 
      typeof field === 'boolean' ? field : field && field.trim() !== ''
    ).length;
    
    return Math.round((completedFields / fields.length) * 100);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Profile updated successfully!",
      description: "Your changes have been saved.",
    });
    
    setIsLoading(false);
  };

  const completion = calculateCompletion();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Profile Completion
              <span className="text-2xl font-bold text-primary">{completion}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completion} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Complete your profile to increase visibility to mentors and employers
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">College/University</label>
                  <Input
                    value={profileData.college}
                    onChange={(e) => setProfileData(prev => ({ ...prev, college: e.target.value }))}
                    placeholder="Enter your college name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Major</label>
                  <Input
                    value={profileData.major}
                    onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                    placeholder="Enter your major"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Year</label>
                  <Input
                    value={profileData.year}
                    onChange={(e) => setProfileData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="e.g., 3rd Year"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <Input
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Bio</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button type="button" onClick={handleAddSkill} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub Profile
                </label>
                <Input
                  value={profileData.github}
                  onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </label>
                <Input
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Portfolio Website</label>
                <Input
                  value={profileData.portfolio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload your resume or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
                <Button variant="outline" className="mt-4" type="button">
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary-glow"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}