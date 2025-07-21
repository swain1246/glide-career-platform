import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  Target, 
  Shield, 
  Zap,
  TrendingUp,
  MessageSquare,
  Award
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Skill-based Mentorship",
    description: "Connect with industry experts who match your career goals and skill development needs.",
    color: "text-primary",
    bgColor: "bg-primary-light"
  },
  {
    icon: Shield,
    title: "Verified Companies",
    description: "Access opportunities from trusted, verified companies posting genuine internships and jobs.",
    color: "text-secondary",
    bgColor: "bg-secondary-light"
  },
  {
    icon: TrendingUp,
    title: "Project Collaboration",
    description: "Work on real-world projects with peers and mentors to build your portfolio.",
    color: "text-accent",
    bgColor: "bg-accent-light"
  },
  {
    icon: Target,
    title: "Personalized Matching",
    description: "AI-powered matching system connects you with the most relevant opportunities.",
    color: "text-primary",
    bgColor: "bg-primary-light"
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description: "Chat directly with mentors, recruiters, and fellow students in our integrated platform.",
    color: "text-secondary",
    bgColor: "bg-secondary-light"
  },
  {
    icon: Award,
    title: "Skill Certification",
    description: "Earn verified skill badges and certifications to showcase your expertise.",
    color: "text-accent",
    bgColor: "bg-accent-light"
  }
];

const LandingFeatures = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Platform Features
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <span className="text-primary"> Succeed</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform brings together students, mentors, and companies 
            in one seamless ecosystem designed for career growth and success.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12 text-white shadow-large">
            <GraduationCap className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Career?
            </h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students, mentors, and companies who are already 
              building the future of work together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Get Started Today
              </button>
              <button className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;