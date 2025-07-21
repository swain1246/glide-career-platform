import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CareerGlide
            </div>
            <p className="text-muted-foreground max-w-xs">
              Connecting talent with opportunity. Build skills, find mentors, and launch your career.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* For Students */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Students</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/jobs" className="hover:text-foreground transition-colors">Browse Jobs</a></li>
              <li><a href="/mentors" className="hover:text-foreground transition-colors">Find Mentors</a></li>
              <li><a href="/skills" className="hover:text-foreground transition-colors">Skill Assessments</a></li>
              <li><a href="/resources" className="hover:text-foreground transition-colors">Career Resources</a></li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="space-y-4">
            <h3 className="font-semibold">For Companies</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/post-job" className="hover:text-foreground transition-colors">Post Jobs</a></li>
              <li><a href="/talent-pool" className="hover:text-foreground transition-colors">Talent Pool</a></li>
              <li><a href="/hiring-solutions" className="hover:text-foreground transition-colors">Hiring Solutions</a></li>
              <li><a href="/pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="/about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="/help" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t">
          <p className="text-muted-foreground text-sm">
            © 2024 CareerGlide. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4 sm:mt-0">
            <a href="/login" className="hover:text-foreground transition-colors">Login</a>
            <span>•</span>
            <a href="/register" className="hover:text-foreground transition-colors">Register</a>
          </div>
        </div>
      </div>
    </footer>
  );
}