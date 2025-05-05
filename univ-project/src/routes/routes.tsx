// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage    from '../components/landingPage/landingPage';
import Login          from '../components/login/login';
import Signup         from '../components/login/signup';
import  MainPage  from '../components/main/MainPage';
import CoursesPage    from '../components/main/CoursesPage';
import ChallengesPage from '../components/main/ChallengesPage';
import ChatPage       from '../components/main/ChatPage';
import LibraryPage    from '../components/main/LibraryPage';
import ProfilePage    from '../components/main/ProfilePage';
import SettingsPage   from '../components/main/SettingsPage';
import LessonPage from '../components/main/LessonsPage';












export default function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);

  const pageTransition = {
    initial:  { opacity: 0, y: 50 },
    animate:  { opacity: 1, y: 0 },
    exit:     { opacity: 0, y: -50 },
    transition: { duration: 0.6, ease: 'easeInOut' },
  };

  return (
    <div
      style={{
        background: 'white',
        position:   'relative',
        overflow:   isAuthRoute ? 'hidden' : 'auto',
        height:     isAuthRoute ? '100vh' : 'auto',
      }}
    >
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* Public */}
          <Route
            path="/"
            element={
              <motion.div {...pageTransition}>
                <LandingPage />
              </motion.div>
            }
          />

          {/* Auth */}
          <Route
            path="/login"
            element={
              <motion.div {...pageTransition}>
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/signup"
            element={
              <motion.div {...pageTransition}>
                <Signup />
              </motion.div>
            }
          />
          <Route
            path="/lesson/:topicId"
            element={
              <motion.div {...pageTransition}>
                <LessonPage />
              </motion.div>
            }
          />

<Route path="/main" element={<MainPage />}>
        <Route index element={<CoursesPage />} />
        <Route path="courses" element={<CoursesPage />} />
        
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>
    </div>
  );
}
