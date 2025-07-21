import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineering Student",
    company: "Stanford University",
    avatar: "AC",
    rating: 5,
    content: "CareerGlide connected me with a senior engineer at Google who became my mentor. The guidance I received was invaluable, and I landed my dream internship!"
  },
  {
    name: "Maria Rodriguez",
    role: "Talent Acquisition Manager",
    company: "Microsoft",
    avatar: "MR",
    rating: 5,
    content: "We've hired 15 exceptional interns through CareerGlide this year. The quality of candidates and the platform's efficiency is outstanding."
  },
  {
    name: "David Kim",
    role: "Senior Data Scientist",
    company: "Netflix",
    avatar: "DK",
    rating: 5,
    content: "Mentoring students through CareerGlide has been incredibly rewarding. The platform makes it easy to share knowledge and help the next generation."
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Student",
    company: "NYU Stern",
    avatar: "SJ",
    rating: 5,
    content: "The project collaboration feature helped me work with students from different universities. We built an amazing portfolio together!"
  },
  {
    name: "James Wilson",
    role: "Startup Founder",
    company: "TechStart Inc.",
    avatar: "JW",
    rating: 5,
    content: "CareerGlide helped us find talented interns who brought fresh perspectives to our startup. Highly recommend for growing companies."
  },
  {
    name: "Emily Davis",
    role: "Computer Science Student",
    company: "MIT",
    avatar: "ED",
    rating: 5,
    content: "The skill-based matching is incredible. I found mentors who were experts in exactly the areas I wanted to grow in."
  }
];

const LandingTestimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent-light text-accent text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2" />
            Success Stories
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Loved by
            <span className="text-accent"> Students</span>,
            <span className="text-primary"> Companies</span>, and
            <span className="text-secondary"> Mentors</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what our community has to say about their CareerGlide experience 
            and how it transformed their career journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-muted opacity-20" />
                  <p className="text-muted-foreground leading-relaxed relative z-10">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary text-white flex items-center justify-center text-sm font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-primary font-medium">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Statistics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary mb-2">5,000+</div>
            <div className="text-muted-foreground">Successful Placements</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">Platform Support</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <div className="text-muted-foreground">Partner Universities</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingTestimonials;