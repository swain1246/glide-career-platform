import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function PostJob() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    skills: [] as string[],
    type: "",
    location: "",
    duration: "",
    stipend: "",
    currency: "USD",
    isRemote: false,
    isActive: true,
    applicationDeadline: "",
    startDate: "",
    minQualification: "",
    experience: ""
  });

  const [newSkill, setNewSkill] = useState("");

  const jobTypes = [
    "Full-time Internship",
    "Part-time Internship", 
    "Project-based",
    "Remote",
    "On-site",
    "Hybrid"
  ];

  const durations = [
    "1-3 months",
    "3-6 months", 
    "6-12 months",
    "1+ years",
    "Flexible"
  ];

  const qualifications = [
    "High School",
    "Currently in College",
    "Bachelor's Degree",
    "Master's Degree",
    "No formal requirement"
  ];

  const experienceLevels = [
    "No experience required",
    "0-1 years",
    "1-2 years",
    "2+ years",
    "Any level"
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !jobData.skills.includes(newSkill.trim())) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobData.title || !jobData.description || !jobData.type) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Job posted successfully!",
      description: "Your job posting is now live and visible to candidates.",
    });
    
    setIsLoading(false);
  };

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Post a New Job</h1>
            <p className="text-muted-foreground">Create an attractive job posting to find the best candidates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Job Title *</label>
                <Input
                  value={jobData.title}
                  onChange={(e) => setJobData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Frontend Developer Intern"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Job Type *</label>
                  <Select value={jobData.type} onValueChange={(value) => setJobData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Duration</label>
                  <Select value={jobData.duration} onValueChange={(value) => setJobData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map(duration => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Input
                    value={jobData.location}
                    onChange={(e) => setJobData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={jobData.isRemote}
                    onCheckedChange={(checked) => setJobData(prev => ({ ...prev, isRemote: checked }))}
                  />
                  <label className="text-sm font-medium text-foreground">Remote work available</label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Job Description *</label>
                <Textarea
                  value={jobData.description}
                  onChange={(e) => setJobData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role, company culture, and what makes this opportunity exciting..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Key Responsibilities</label>
                <Textarea
                  value={jobData.responsibilities}
                  onChange={(e) => setJobData(prev => ({ ...prev, responsibilities: e.target.value }))}
                  placeholder="• List key responsibilities and day-to-day tasks&#10;• What will the intern be working on?&#10;• Any special projects or learning opportunities?"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Requirements</label>
                <Textarea
                  value={jobData.requirements}
                  onChange={(e) => setJobData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="• Education requirements&#10;• Years of experience needed&#10;• Any specific qualifications or certifications"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills & Qualifications */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Qualifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Required Skills</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {jobData.skills.map((skill) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Minimum Qualification</label>
                  <Select value={jobData.minQualification} onValueChange={(value) => setJobData(prev => ({ ...prev, minQualification: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select minimum qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map(qual => (
                        <SelectItem key={qual} value={qual}>{qual}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Experience Level</label>
                  <Select value={jobData.experience} onValueChange={(value) => setJobData(prev => ({ ...prev, experience: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map(exp => (
                        <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compensation & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Stipend Amount</label>
                  <Input
                    type="number"
                    value={jobData.stipend}
                    onChange={(e) => setJobData(prev => ({ ...prev, stipend: e.target.value }))}
                    placeholder="e.g., 1500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Currency</label>
                  <Select value={jobData.currency} onValueChange={(value) => setJobData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Per</label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Hour</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Application Deadline</label>
                  <Input
                    type="date"
                    value={jobData.applicationDeadline}
                    onChange={(e) => setJobData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Start Date</label>
                  <Input
                    type="date"
                    value={jobData.startDate}
                    onChange={(e) => setJobData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={jobData.isActive}
                onCheckedChange={(checked) => setJobData(prev => ({ ...prev, isActive: checked }))}
              />
              <label className="text-sm font-medium text-foreground">
                Publish immediately
              </label>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" type="button">
                Save as Draft
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}