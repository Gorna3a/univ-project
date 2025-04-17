// src/components/TestimonialsSection.tsx
import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "This platform made learning Java so much fun! The AI tutor is amazing.",
    name: "Jane Doe",
  },
  {
    quote: "I love the gamified experience. It keeps me motivated!",
    name: "John Smith",
  },
  {
    quote:
      "The instant feedback helped me improve my coding skills quickly.",
    name: "Emily Johnson",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-gray-900 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
            >
              <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-green-400">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
