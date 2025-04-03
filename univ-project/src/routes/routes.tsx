// routes.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from '../components/login';
import Signup from '../components/signup';
import LandingPage from '../components/landingPage'; // Import the new Landing Page component

export default function AppRoutes() {
  const location = useLocation();

  return (
    <div
      style={{
        background: 'white',
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
      }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* Login Route */}
          <Route
            path="/login"
            element={
              <motion.div
                style={{
                  background: '#212385',
                  position: 'absolute',
                  width: '100%',
                  minHeight: '100vh',
                }}
                key={location.pathname}
                initial={{ y: '-100vh', rotate: 10 }}
                animate={{ y: 0, rotate: 0 }}
                exit={{ y: '100vh', rotate: -10 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Login />
              </motion.div>
            }
          />

          {/* Signup Route */}
          <Route
            path="/signup"
            element={
              <motion.div
                style={{
                  background: '#212385',
                  position: 'absolute',
                  width: '100%',
                  minHeight: '100vh',
                }}
                key={location.pathname}
                initial={{ y: '100vh', rotate: 10 }}
                animate={{ y: 0, rotate: 0 }}
                exit={{ y: '-100vh', rotate: -10 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <Signup />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      </div>
  );
  
}