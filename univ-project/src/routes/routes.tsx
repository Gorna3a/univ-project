// routes.tsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from '../components/login/login';
import Signup from '../components/login/sign/signup';
import LandingPage from '../components/landingPage/landingPage';

export default function AppRoutes() {
  const location = useLocation();

  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div
      style={{
        background: 'white',
        position: 'relative',
        overflow: isAuthRoute ? 'hidden' : 'auto',
        height: isAuthRoute ? '100vh' : 'auto',
      }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing Page Route */}
          <Route
            path="/"
            element={
              <motion.div
                style={{
                  
                  position: 'absolute',
                  width: '100%',
                  minHeight: '100vh',
                }}
                key={location.pathname}
                initial={{ y: '-100vh'  }}
                animate={{ y: 0,  }}
                exit={{ y: '100vh' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                <LandingPage />
              </motion.div>
            }
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              <motion.div
                style={{
                  
                  position: 'absolute',
                  width: '100%',
                  minHeight: '100vh',
                }}
                key={location.pathname}
                initial={{ y: '-100vh' }}
                animate={{ y: 0 }}
                exit={{ y: '100vh' }}
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
                  
                  position: 'absolute',
                  width: '100%',
                  minHeight: '100vh',
                }}
                key={location.pathname}
                initial={{ y: '100vh'}}
                animate={{ y: 0}}
                exit={{ y: '-100vh' }}
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
