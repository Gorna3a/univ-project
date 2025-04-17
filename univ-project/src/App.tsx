import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import React from 'react';
import LandingPage from './components/landingPage/landingPage';
import AppRoutes from './routes/routes';



function App() {
  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
