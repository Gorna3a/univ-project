import React from "react";
import HeroSection from "./heroSection";
import FeaturesSection from "./featuresSection";
import HowItWorksSection from "./howItWorksSection";
import TestimonialsSection from "./testimonialsSection";
import FooterSection from "./footerSection";
import NavigationMenuDemo from "./navigationMenu";

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page  flex flex-col ">
      {/* Navigation Menu Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur">
        <div className="flex h-14  items-center w-full pl-4 pr-4 ">
          <div>
        <h1 className="text-2xl font-bold text-black ml-4">LearnJava</h1>
        </div>
           <div className="flex space-x-4 pr-30 pl-20">
          <NavigationMenuDemo />
          </div>
        </div>
      </header>


      <section id="hero" className="hero-section h-auto min-h-screen py-35 bg-gradient-to-b from-gray-900 to-gray-800">
      <HeroSection />
      </section>
        
      <section id="features" className="features-section py-32 bg-gray-900 text-white">
      <FeaturesSection />
      </section>
      
      <section id="how-it-works" className="how-it-works-section py-32 bg-gray-800 text-white">
      <HowItWorksSection />
      </section>

      <section id="testimonials" className="testimonials-section py-32 bg-gray-900">
      <TestimonialsSection />
      </section>

      <section id="footer" className="footer-section py-20 bg-black text-white">
      <FooterSection />
      </section>

    </div>
  );
};

export default LandingPage;
