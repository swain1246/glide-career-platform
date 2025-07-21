import { ArrowRight, Users, Star, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import heroImage from "../assets/hero-image.jpg";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container relative px-4 py-16 mx-auto sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                🚀 Launch Your Career Journey
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Launch Careers.
                </span>
                <br />
                Build Skills.
                <br />
                <span className="text-foreground">Get Hired.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground sm:text-xl max-w-lg">
                Connect students with top companies, find experienced mentors, and 
                build the skills that matter. Your career journey starts here.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Join as Student
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Post Jobs
              </Button>
              <Button variant="ghost" size="lg">
                Mentor Talent
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2.5K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">150+</div>
                <div className="text-sm text-muted-foreground">Mentors</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative lg:ml-8">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-card shadow-card">
              <img
                src={heroImage}
                alt="CareerGlide Platform"
                className="h-full w-full object-cover"
              />
            </div>
            
            {/* Floating cards */}
            <Card className="absolute -top-4 -left-4 p-4 shadow-card-hover">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Active Connections</div>
                  <div className="text-xs text-muted-foreground">+12% this week</div>
                </div>
              </div>
            </Card>

            <Card className="absolute -bottom-4 -right-4 p-4 shadow-card-hover">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div>
                  <div className="text-sm font-medium">Placement Rate</div>
                  <div className="text-xs text-muted-foreground">92% success</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}