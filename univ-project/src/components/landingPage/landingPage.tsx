import React from "react";
import ThemeToggle from "../ThemeToggle";
import { Link } from "react-router-dom";
import Typewriter from "./TypeWriter";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-black dark:text-white">Pixel Code</h1>
          <nav className="flex items-center space-x-8">
            <Link to="#features" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Features</Link>
            <Link to="#how" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">How it Works</Link>
            <Link to="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Testimonials</Link>
            <Link 
              to="/signup" 
              className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-sm"
            >
              Get Started
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-40 px-4 space-y-8">
        <div className="text-4xl md:text-5xl font-medium max-w-3xl px-4">
          <p className="whitespace-pre-wrap leading-tight">
            <span>{"We make it easier for you to "}</span>
            <Typewriter
              text={[
                "have fun",
                "learn",
                "get better",
                "code",
                "become a pro",
                "get hired",
              ]}
              speed={70}
              className="text-yellow-500"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </p>
        </div>
        <Link 
          to="/signup" 
          className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all text-lg font-medium shadow-lg hover:shadow-blue-500/20"
        >
          Start Learning Java Now →
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto space-y-16">
          <h3 className="text-4xl font-bold text-center text-black dark:text-white">Powerful Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black dark:text-white mb-2">Interactive Lessons</h4>
              <p className="text-gray-600 dark:text-gray-400">Hands-on coding with instant feedback in our browser-based IDE.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black dark:text-white mb-2">Smart Challenges</h4>
              <p className="text-gray-600 dark:text-gray-400">Practice problems tailored to your skill level and weaknesses.</p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black dark:text-white mb-2">AI Assistant</h4>
              <p className="text-gray-600 dark:text-gray-400">Get personalized help and hints from your AI tutor anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-32 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          <h3 className="text-4xl font-bold text-black dark:text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Sign Up', desc: 'Create your free account' },
              { number: '2', title: 'Choose Path', desc: 'Select your Java track' },
              { number: '3', title: 'Learn', desc: 'Complete interactive lessons' },
              { number: '4', title: 'Earn XP', desc: 'Level up your skills' },
            ].map((step) => (
              <div key={step.number} className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {step.number}
                </div>
                <h4 className="text-xl font-semibold text-black dark:text-white">{step.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto space-y-16">
          <h3 className="text-4xl font-bold text-center text-black dark:text-white">What Our Learners Say</h3>
          <div className="space-y-8">
            {[
              "This app made Java fun for the first time. The AI assistant is amazing!",
              "Better than watching tutorials. I actually *do* the code!",
              "Went from beginner to job-ready in 3 months with Pixel Code."
            ].map((testimonial, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  <div>
                    <h4 className="font-semibold text-black dark:text-white">
                      {['Alex', 'Sara', 'Jamal'][i]}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Java Developer</p>
                  </div>
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="text-3xl md:text-4xl font-bold">Ready to start your Java journey?</h3>
          <p className="text-xl opacity-90">Join thousands of learners today</p>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all text-lg font-medium shadow-lg hover:shadow-white/20"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center space-x-8 mb-6">
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} LearnJava. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;