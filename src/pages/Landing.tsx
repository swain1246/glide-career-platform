import Navbar from "@/components/layout/Navbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingFooter />
    </div>
  );
};

export default Landing;