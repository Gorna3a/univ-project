import React from "react";

import ThemeToggle from "../ThemeToggle";
import { Link } from "react-router-dom";
import Typewriter from "./TypeWriter"; // Ensure you have this component

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Sticky header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">LearnJava</h1>
          <nav className="flex items-center space-x-6">
            <Link to="#features" className="text-gray-700 dark:text-gray-300 hover:underline">Features</Link>
            <Link to="#how" className="text-gray-700 dark:text-gray-300 hover:underline">How it Works</Link>
            <Link to="#testimonials" className="text-gray-700 dark:text-gray-300 hover:underline">Testimonials</Link>
            <Link to="/signup" className="bg-black text-white px-4 py-2 rounded hover:opacity-90 dark:bg-white dark:text-black">Get Started</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
      <div className="text-3xl flex items-start justify-start p-12">
      <p className="whitespace-pre-wrap">
        <span>{"We're born 🌞 to "}</span>
        <Typewriter
          text={[
            "experience",
            "dance",
            "love",
            "be alive",
            "create things good",
          ]}
          speed={70}
          className="text-yellow-500"
          waitTime={1500}
          deleteSpeed={40}
          cursorChar={"_"}
        />
      </p>
    </div>
        <Link to="/signup" className="mt-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Start Learning
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 text-center bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-semibold mb-6 text-black dark:text-white">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">Interactive Lessons</h4>
            <p className="text-gray-700 dark:text-gray-300">Hands-on coding with instant feedback.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">Smart Challenges</h4>
            <p className="text-gray-700 dark:text-gray-300">Practice tailored to your weaknesses.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-black dark:text-white">AI Assistant</h4>
            <p className="text-gray-700 dark:text-gray-300">Get help and hints from your AI tutor.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 text-center bg-white dark:bg-gray-900">
        <h3 className="text-3xl font-semibold mb-6 text-black dark:text-white">How It Works</h3>
        <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Sign up, choose your Java path, complete lessons, earn XP, and unlock challenges.
        </p>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-gray-100 dark:bg-gray-800">
        <h3 className="text-3xl font-semibold text-center text-black dark:text-white mb-8">What Learners Say</h3>
        <div className="max-w-4xl mx-auto space-y-6">
          <blockquote className="text-center text-gray-800 dark:text-gray-200">
            “This app made Java fun for the first time. The AI assistant is amazing!” – Alex
          </blockquote>
          <blockquote className="text-center text-gray-800 dark:text-gray-200">
            “Better than watching tutorials. I actually *do* the code!” – Sara
          </blockquote>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border-t">
        © {new Date().getFullYear()} LearnJava. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
