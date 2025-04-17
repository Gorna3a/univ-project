// src/components/FeaturesSection.tsx
import { motion } from "framer-motion";
import { Lightbulb, Gamepad2, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Lightbulb className="h-12 w-12 text-green-500 mb-4" />,
    title: "AI-Powered Tutor",
    description: "Get personalized guidance and hints powered by advanced AI.",
  },
  {
    icon: <Gamepad2 className="h-12 w-12 text-green-500 mb-4" />,
    title: "Gamified Learning",
    description: "Earn XP, unlock achievements, and track your progress.",
  },
  {
    icon: <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />,
    title: "Instant Feedback",
    description: "Get real-time feedback on your code and improve instantly.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-gray-900 text-white py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h3 className="text-2xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

  