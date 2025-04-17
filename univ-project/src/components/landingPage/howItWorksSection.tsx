// src/components/HowItWorksSection.tsx
import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Sign Up",
    description: "Create an account and start your journey.",
  },
  {
    number: 2,
    title: "Learn & Play",
    description: "Complete interactive lessons and coding challenges.",
  },
  {
    number: 3,
    title: "Level Up",
    description: "Track progress, earn badges, and improve your skills.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="bg-gray-800 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl shadow-md"
            >
              <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
