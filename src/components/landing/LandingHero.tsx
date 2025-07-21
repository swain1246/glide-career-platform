import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Briefcase, GraduationCap } from "lucide-react";

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
          <GraduationCap className="w-4 h-4 mr-2" />
          The Future of Career Development
        </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Launch Careers.
              <br />
              <span className="text-accent">Build Skills.</span>
              <br />
              Get Hired.
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Connect students with mentors, companies with talent, and build the future workforce through skill-based learning and meaningful connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" variant="secondary" className="group">
                Join as Student
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Post Jobs (Company)
                <Briefcase className="w-4 h-4 ml-2" />
              </Button>
              
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Mentor Talent
                <Users className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-white">
              <div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-white/80 text-sm">Active Students</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/80 text-sm">Partner Companies</div>
              </div>
              <div>
                <div className="text-2xl font-bold">2K+</div>
                <div className="text-white/80 text-sm">Expert Mentors</div>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative animate-scale-in delay-300">
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-large">
              <div className="bg-gradient-card rounded-2xl p-6 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Success Story</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  "CareerGlide connected me with an amazing mentor who helped me land my dream internship at a Fortune 500 company!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-3">
                    SA
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sarah Anderson</div>
                    <div className="text-xs text-muted-foreground">Computer Science Student</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary-light rounded-xl p-4">
                  <div className="text-secondary text-2xl font-bold">95%</div>
                  <div className="text-xs text-muted-foreground">Job Placement Rate</div>
                </div>
                <div className="bg-accent-light rounded-xl p-4">
                  <div className="text-accent text-2xl font-bold">4.9</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;