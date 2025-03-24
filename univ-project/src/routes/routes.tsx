import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from '../components/login';
import Signup from '../components/signup';

export default function AppRoutes() {
  return (
    <Router>
      <AnimatePresence mode='wait'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Signup />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}