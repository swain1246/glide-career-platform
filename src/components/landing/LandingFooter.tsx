import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github,
  Facebook,
  ArrowRight
} from "lucide-react";

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with CareerGlide
            </h3>
            <p className="text-white/80 mb-8">
              Get the latest career tips, job opportunities, and platform updates 
              delivered straight to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button variant="secondary" className="group">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mr-3">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">CareerGlide</span>
            </div>
            
            <p className="text-white/80 mb-6 leading-relaxed">
              Connecting students, mentors, and companies to build the future 
              workforce through skill-based learning and meaningful connections.
            </p>
            
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Twitter className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                <Facebook className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">For Companies</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">For Mentors</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Career Guide</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Interview Tips</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Resume Builder</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="text-white/80">hello@careerglide.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <span className="text-white/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-primary" />
                <span className="text-white/80">San Francisco, CA</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Support</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact Support</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © {currentYear} CareerGlide. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;