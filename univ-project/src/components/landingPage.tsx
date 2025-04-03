import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">

<nav className="navbar">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">LearnJava</h1>
          <div>
            <Link to="/signup" className="hover:text-green-500">
              Sign Up
            </Link>
            <Link to="/login" className="ml-4 hover:text-green-500">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="text-center z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 hero-title">
            Learn Java the Fun Way!
          </h1>
          <p className="text-xl md:text-2xl mb-8 hero-subtitle">
            Gamified learning, instant feedback, and AI-powered tutoring.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
            >
              Get Started
            </Link>
            <Link
              to="/features"
              className="bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg text-lg font-semibold transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Background Shapes for Parallel Scrolling */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-full h-full bg-[url('/shapes.png')] bg-repeat-x"
        ></motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: AI Tutor */}
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <h3 className="text-2xl font-semibold mb-2">AI-Powered Tutor</h3>
                <p className="text-gray-400">
                  Get personalized guidance and hints powered by advanced AI.
                </p>
              </motion.div>
            </div>

            {/* Feature 2: Gamified Learning */}
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <h3 className="text-2xl font-semibold mb-2">Gamified Learning</h3>
                <p className="text-gray-400">
                  Earn XP, unlock achievements, and track your progress as you learn.
                </p>
              </motion.div>
            </div>

            {/* Feature 3: Instant Feedback */}
            <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-2xl font-semibold mb-2">Instant Feedback</h3>
                <p className="text-gray-400">
                  Get real-time feedback on your code and improve instantly.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-400">
                Create an account and start your journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn & Play</h3>
              <p className="text-gray-400">
                Complete interactive lessons and challenges.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Level Up</h3>
              <p className="text-gray-400">
                Track your progress and earn rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-400 italic mb-4">
                "This platform made learning Java so much fun! The AI tutor is amazing."
              </p>
              <p className="font-semibold">- Jane Doe</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-400 italic mb-4">
                "I love the gamified experience. It keeps me motivated!"
              </p>
              <p className="font-semibold">- John Smith</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-400 italic mb-4">
                "The instant feedback helped me improve my coding skills quickly."
              </p>
              <p className="font-semibold">- Emily Johnson</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2023 LearnJava. All rights reserved.
          </p>
          <div className="mt-4">
            <a href="#" className="text-green-500 hover:underline mx-2">
              Privacy Policy
            </a>
            <a href="#" className="text-green-500 hover:underline mx-2">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;