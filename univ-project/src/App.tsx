import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './routes/routes';
import React from 'react';
import LandingPage from './components/landingPage';


function App() {
  return (
    <Router>
      <LandingPage />
    </Router>
  );
}

export default App;
