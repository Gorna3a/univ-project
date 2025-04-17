// src/components/HeroSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import background from "../../assets/backgroundHero.jpg"; // Adjust the path as necessary

const HeroSection = () => {
  return (
    
    <section className="relative text-white min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Blurry background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-15"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl flex flex-col items-center text-center gap-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold">
          Learn Coding the Fun Way!
        </h1>
        <p className="text-xl">
          Gamified lessons. AI tutor. Instant feedback.
        </p>
        
        <div className="flex justify-center gap-10 mt-40">
          <Link
            to="/signup"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition z-10"
          >
            Get Started
          </Link>
          <Link
            to="/features"
            className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg text-lg font-semibold transition z-10"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
