import { useState } from "react";
import { Search, Filter, MapPin, DollarSign, Clock, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { JobCard } from "../../components/JobCard";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { jobs } from "../../data/jobs";
import { Topbar } from "../../components/Topbar";
import { Footer } from "../../components/Footer";

const JobsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const locations = Array.from(new Set(jobs.map(job => job.location)));
  const types = Array.from(new Set(jobs.map(job => job.type)));
  const allSkills = Array.from(new Set(jobs.flatMap(job => job.skills)));

  // Filter jobs based on current filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = selectedLocation === "all" || job.location === selectedLocation;
    const matchesType = selectedType === "all" || job.type === selectedType;
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => job.skills.includes(skill));

    return matchesSearch && matchesLocation && matchesType && matchesSkills;
  });

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedType("all");
    setSelectedSkills([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Internship</h1>
          <p className="text-muted-foreground">
            Discover opportunities from top companies. {filteredJobs.length} jobs available.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-40">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  More Filters
                  {(selectedSkills.length > 0) && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedSkills.length}
                    </Badge>
                  )}
                </Button>

                {(searchQuery || selectedLocation !== "all" || selectedType !== "all" || selectedSkills.length > 0) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Filter</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {allSkills.slice(0, 20).map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <label 
                            htmlFor={skill}
                            className="text-sm cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Display */}
        {(selectedSkills.length > 0 || selectedLocation !== "all" || selectedType !== "all") && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedLocation !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedLocation}
                </Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {selectedType}
                </Badge>
              )}
              {selectedSkills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or removing some filters.
                </p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job}
                onApply={(jobId) => console.log('Apply to job:', jobId)}
                onViewDetails={(jobId) => console.log('View job details:', jobId)}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default JobsPage;