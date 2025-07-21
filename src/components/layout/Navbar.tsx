import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">CareerGlide</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            
            <div className="relative group">
              <button className="flex items-center font-medium text-foreground hover:text-primary transition-colors">
                For Students
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link to="/student/register" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Student Registration
                  </Link>
                  <Link to="/jobs" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Browse Jobs
                  </Link>
                  <Link to="/mentors" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Find Mentors
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="flex items-center font-medium text-foreground hover:text-primary transition-colors">
                For Companies
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link to="/company/register" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Company Registration
                  </Link>
                  <Link to="/company/post-job" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Post Jobs
                  </Link>
                  <Link to="/talent" className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    Browse Talent
                  </Link>
                </div>
              </div>
            </div>
            
            <Link
              to="/mentors"
              className={`font-medium transition-colors ${
                isActive("/mentors") ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              Mentors
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="space-y-4">
              <Link
                to="/"
                className="block font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground text-sm">For Students</div>
                <Link
                  to="/student/register"
                  className="block pl-4 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Student Registration
                </Link>
                <Link
                  to="/jobs"
                  className="block pl-4 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Browse Jobs
                </Link>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground text-sm">For Companies</div>
                <Link
                  to="/company/register"
                  className="block pl-4 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Company Registration
                </Link>
                <Link
                  to="/company/post-job"
                  className="block pl-4 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Post Jobs
                </Link>
              </div>
              
              <Link
                to="/mentors"
                className="block font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Mentors
              </Link>
              
              <div className="pt-4 space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;